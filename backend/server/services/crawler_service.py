import asyncio
import uuid
from typing import List, Dict, Optional
from datetime import datetime
import random

from ..services.meme_processor import meme_processor

class CrawlerService:
    def __init__(self):
        self.workers: Dict[str, Dict] = {}
        self.active_crawls: Dict[str, asyncio.Task] = {}
        # Initialize some mock workers
        self._init_mock_workers()

    def _init_mock_workers(self):
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
        """
        Initiates a crawl job.
        In a real implementation, this would push a task to Celery/RabbitMQ.
        Here, we simulate it with an asyncio task.
        """
        job_id = str(uuid.uuid4())
        
        # Find an idle worker
        worker = self._get_idle_worker()
        if not worker:
            # Auto-scale (mock)
            worker = self._spawn_worker()
        
        worker["status"] = "ACTIVE"
        worker["current_task"] = f"crawling {seed_url}"
        
        # Start the mock crawl process
        task = asyncio.create_task(self._mock_crawl_process(worker["id"], seed_url, job_id))
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

    async def _mock_crawl_process(self, worker_id: str, url: str, job_id: str):
        worker = self.workers[worker_id]
        
        try:
            # Simulate network delay and processing
            duration = random.randint(5, 15)
            
            # Generate some "discovered" content during the crawl
            for _ in range(3):
                await asyncio.sleep(duration / 3)
                worker["throughput"] = random.uniform(0.5, 2.5)
                
                # Mock content discovery
                mock_content = f"Discovered interesting insight from {url}: {self._generate_mock_insight()}"
                await meme_processor.process_raw_content(
                    content=mock_content,
                    source="Crawler",
                    metadata={"url": url, "worker": worker_id}
                )
            
            worker["status"] = "IDLE"
            worker["current_task"] = None
            worker["throughput"] = 0.0
            
        except Exception as e:
            worker["status"] = "ERROR"
            worker["current_task"] = f"Error: {str(e)}"

    def _generate_mock_insight(self) -> str:
        templates = [
            "The noosphere is expanding at an exponential rate.",
            "AI alignment is converging with spiritual non-duality.",
            "Decentralized networks are the nervous system of the planet.",
            "Hyperstition is becoming reality through meme magic.",
            "Recursive self-improvement loops detected in local clusters."
        ]
        return random.choice(templates)

crawler_service = CrawlerService()
