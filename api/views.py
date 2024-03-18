from django.http import HttpResponse
from .models import TASK
from .serializer import Task_Serializer
from rest_framework.decorators import api_view
from rest_framework.response import Response


# # Create your views here.
# def home(request):
#     return HttpResponse("This is the home page ")

# @api_view(["GET"])
# def taskList(request):
#     list = TASK.objects.all().order_by("-id")
#     serializer = Task_Serializer(list, many=True)
#     return Response(serializer.data)


@api_view(["GET"])
def taskList(request):
	tasks = TASK.objects.all().order_by('-id')
	print(tasks)
	serializer = Task_Serializer(tasks, many=True)
	return Response(serializer.data)


@api_view(['GET'])
def task_datail(request, pk):
	task = TASK.objects.get(id=pk)
	serializer = Task_Serializer(task, many=False)
	return Response(serializer.data)

@api_view(["POST"])
def create_task(request):
	serializer = Task_Serializer(data=request.data)
	if serializer.is_valid():
		serializer.save()
	return Response(serializer.data)

@api_view(["POST"])
def task_update(request, pk):
	task = TASK.objects.get(id=pk)
	serializer = Task_Serializer(instance=task, data = request.data)
	if serializer.is_valid():
		serializer.save()
	return Response(serializer.data)

@api_view(["DELETE"])
def delete_task(request, pk):
	task = TASK.objects.get(id=pk)
	task.delete()
	return Response("Item successfull deleted .")
	
	
	

