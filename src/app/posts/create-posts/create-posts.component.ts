import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Post } from '../post.model';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-create-posts',
  templateUrl: './create-posts.component.html',
  styleUrls: ['./create-posts.component.css'],
})
export class CreatePostsComponent implements OnInit {
  enteredTitle: string = '';
  enteredContent: string = '';

  constructor(private postService: PostService) {}

  ngOnInit(): void {}

  onAddPost(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }
    const post: Post = {
      title: postForm.value.title,
      content: postForm.value.content,
    };
    this.postService.addPost(post);
  }
}
