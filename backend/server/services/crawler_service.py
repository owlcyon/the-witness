import asyncio
import uuid
import re
from typing import List, Dict, Optional
from datetime import datetime
from playwright.async_api import async_playwright, Browser, Page

from ..services.meme_processor import meme_processor

class CrawlerService:
    def __init__(self):
        self.workers: Dict[str, Dict] = {}
        self.active_crawls: Dict[str, asyncio.Task] = {}
        self._init_mock_workers()
        self.browser: Optional[Browser] = None
        self.playwright = None

    async def initialize(self):
        """Start the browser engine"""
        if not self.playwright:
            self.playwright = await async_playwright().start()
            self.browser = await self.playwright.chromium.launch(headless=True)
            print("Crawler Service: Browser Engine Started")

    async def cleanup(self):
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    def _init_mock_workers(self):
        # Keep worker abstraction for UI visualization
        for i in range(3):
            worker_id = f"worker-{uuid.uuid4().hex[:4]}"
            self.workers[worker_id] = {
                "id": worker_id,
                "status": "IDLE",
                "current_task": None,
                "domain_shard": ["x.com", "reddit.com", "substack.com"][i],
                "throughput": 0.0,
                "last_active": datetime.utcnow().isoformat()
            }

    async def start_crawl(self, seed_url: str, priority: str = "standard") -> str:
        job_id = str(uuid.uuid4())
        
        worker = self._get_idle_worker()
        if not worker:
            worker = self._spawn_worker()
        
        worker["status"] = "ACTIVE"
        worker["current_task"] = f"crawling {seed_url}"
        
        task = asyncio.create_task(self._crawl_process(worker["id"], seed_url, job_id))
        self.active_crawls[job_id] = task
        
        return job_id

    def get_workers(self) -> List[Dict]:
        return list(self.workers.values())

    def _get_idle_worker(self) -> Optional[Dict]:
        for worker in self.workers.values():
            if worker["status"] == "IDLE":
                return worker
        return None

    def _spawn_worker(self) -> Dict:
        worker_id = f"worker-{uuid.uuid4().hex[:4]}"
        worker = {
            "id": worker_id,
            "status": "IDLE",
            "current_task": None,
            "domain_shard": "auto-assigned",
            "throughput": 0.0,
            "last_active": datetime.utcnow().isoformat()
        }
        self.workers[worker_id] = worker
        return worker

    async def _crawl_process(self, worker_id: str, url: str, job_id: str):
        worker = self.workers[worker_id]
        
        try:
            # Lazy init browser if needed
            if not self.browser:
                await self.initialize()

            # Create context and page
            context = await self.browser.new_context(
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                viewport={'width': 1280, 'height': 720}
            )
            page = await context.new_page()

            try:
                # Go to URL
                print(f"Crawling: {url}")
                await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                
                # Wait a bit for JS to hydrate (important for SPAs)
                await page.wait_for_timeout(2000) 
                
                # Get Title
                title = await page.title()
                
                # Get Content
                # Get Content Strategy: Mix of Meta Tags and Selectors
                # 1. First, grab key meta tags which often contain the "real" content even behind login walls
                meta_content = await page.evaluate("""() => {
                    const getMeta = (name) => {
                        const el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
                        return el ? el.content : null;
                    };
                    return {
                        description: getMeta('description') || getMeta('og:description') || getMeta('twitter:description'),
                        title: getMeta('og:title') || getMeta('twitter:title'),
                        text: getMeta('twitter:text') || getMeta('og:description')
                    };
                }""")

                # 2. Try to get specific main content (better than generic body)
                main_text = await page.evaluate("""() => {
                    const article = document.querySelector('article, [role="main"], .main-content');
                    if (article) return article.innerText;
                    
                    // Fallback to body but clean it
                    const scripts = document.querySelectorAll('script, style, noscript, nav, footer, header');
                    scripts.forEach(s => s.remove());
                    return document.body.innerText;
                }""")
                
                # Logic: If meta description exists and body looks like a login wall, use meta
                # X.com often puts "Sign up" in the body but leaves the tweet in og:description
                clean_body = re.sub(r'\s+', ' ', main_text).strip()
                
                final_content = clean_body
                if meta_content['text']:
                    # Prefer meta text if body is short or generic
                    if len(clean_body) < 100 or "sign up" in clean_body.lower() or "log in" in clean_body.lower():
                        final_content = f"{meta_content['text']} (Source: Meta Tag)"
                    else:
                        # Append meta as context
                        final_content = f"{final_content}\n\nContext: {meta_content['text']}"

                worker["throughput"] = len(final_content) / 1024
                
                # Intelligent Title Selection
                final_title = title
                if meta_content['title'] and (not title or "sign up" in title.lower() or "log in" in title.lower() or "x" == title.strip()):
                     final_title = meta_content['title']

                # Send to processor
                await meme_processor.process_raw_content(
                    content=f"{final_title}: {final_content[:3000]}", # Grab more context for LLM
                    source="Crawler V2",
                    metadata={"url": url, "worker": worker_id, "full_title": final_title, "length": len(final_content)}
                )

            finally:
                await context.close()
            
            worker["status"] = "IDLE"
            worker["current_task"] = None
            worker["throughput"] = 0.0
            
        except Exception as e:
            print(f"Crawl Error: {e}")
            worker["status"] = "ERROR"
            worker["current_task"] = f"Error: {str(e)}"
            await meme_processor.process_raw_content(
                content=f"Failed to crawl {url}: {str(e)}",
                source="System",
                metadata={"url": url, "type": "error"}
            )

crawler_service = CrawlerService()
