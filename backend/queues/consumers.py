import json
from channels.generic.websocket import AsyncWebsocketConsumer

class QueueConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.business_id = self.scope['url_route']['kwargs']['business_id']
        self.group_name = f'queue_{self.business_id}'

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'queue_update',
                'message': data
            }
        )

    async def queue_update(self, event):
        await self.send(text_data=json.dumps(event['message']))
