from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True) # automatically populate on new instance
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    # foriegn key links pieces of data together.
    # on delete, the user will also delete all notes that have been passed.
    # related name of "notes" is field name put on the user to reference all of its notes
    
    def __str__(self):
        return self.title