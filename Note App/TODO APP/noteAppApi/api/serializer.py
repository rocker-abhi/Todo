from rest_framework  import serializers
from . import models

class Task_Serializer(serializers.ModelSerializer):
    class Meta:
        model = models.TASK
        fields = "__all__"