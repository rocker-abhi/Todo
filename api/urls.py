
from django.urls import path
from . import views 

urlpatterns = [
    path('', views.taskList),
    path('task-detail/<int:pk>', views.task_datail),
    path('create-task/', views.create_task),
    path('update-task/<int:pk>', views.task_update),
    path('task-delete/<int:pk>', views.delete_task)
]
