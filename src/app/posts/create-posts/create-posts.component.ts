import { Component, EventEmitter, OnInit, Output } from '@angular/core';

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

  onAddPost() {
    const post: Post = {
      title: this.enteredTitle,
      content: this.enteredContent,
    };
    this.postCreated.emit(post);
  }
}
