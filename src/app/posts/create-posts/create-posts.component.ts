import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

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
  post: Post;
  private mode = 'create';
  private postId: string;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId).subscribe((postData) => {
          // console.log(postData);
          this.post = {
            id: postData.post._id,
            title: postData.post.title,
            content: postData.post.content,
          };
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(postForm: NgForm) {
    const post: Post = {
      id: this.postId,
      title: postForm.value.title,
      content: postForm.value.content,
    };
    if (postForm.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postService.addPost(post);
    } else {
      this.postService.updatePost(post);
    }
    postForm.resetForm();
  }
}
