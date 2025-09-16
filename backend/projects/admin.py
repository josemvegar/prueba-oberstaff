from django.contrib import admin
from .models import Project, Membership, Task, Comment
# Register your models here.
admin.site.register(Project)
admin.site.register(Membership)
admin.site.register(Task)
admin.site.register(Comment)