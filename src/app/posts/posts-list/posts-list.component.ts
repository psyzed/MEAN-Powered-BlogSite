import { Component, OnInit } from '@angular/core';

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

  posts: { title: string; content: string }[] = [];

  constructor() {}

  ngOnInit(): void {}
}
