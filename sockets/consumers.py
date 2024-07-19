import json
from channels.generic.websocket import AsyncWebsocketConsumer
from api.models import CustomUser, Instruction
from api.serializers import InstructionSerializer
from django.conf import settings

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.id = self.scope["url_route"]["kwargs"]["task_id"]
        self.room_group_name = f"chat_{self.id}"
        print('User')
        print(self.scope["user"])

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def chat_message(self, event):
        message = event["message"]
        
        await self.send(text_data=json.dumps({"message": message}))