import { formatCurrency } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Post } from '../post.model';

@Component({
  selector: 'app-create-posts',
  templateUrl: './create-posts.component.html',
  styleUrls: ['./create-posts.component.css'],
})
export class CreatePostsComponent implements OnInit {
  enteredTitle: string = '';
  enteredContent: string = '';
  @Output() postCreated = new EventEmitter<Post>();

  constructor() {}

  ngOnInit(): void {}

  onAddPost(postForm: NgForm) {
    if (postForm.invalid) {
      return;
    }
    const post: Post = {
      title: postForm.value.title,
      content: postForm.value.content,
    };
    this.postCreated.emit(post);
  }
}
