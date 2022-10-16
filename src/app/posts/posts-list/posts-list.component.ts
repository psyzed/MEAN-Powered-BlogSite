import { Component, Input, OnInit } from '@angular/core';

import { Post } from '../post.model';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css'],
})
export class PostsListComponent implements OnInit {
  // posts: { title: string; content: string }[] = [
  //   { title: 'First Post', content: 'This is the first post!' },
  //   { title: 'Second Post', content: 'This is the second post!' },
  //   { title: 'Third Post', content: 'This is the third post!' },
  // ];

  @Input() posts: Post[] = [];

  constructor(private postService: PostService) {}

  ngOnInit(): void {
    this.posts = this.postService.getPosts();
  }
}
