import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private postId: string;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((postData) => {
          // console.log(postData);
          this.isLoading = false;
          this.post = {
            id: postData.post._id,
            title: postData.post.title,
            content: postData.post.content,
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    const post: Post = {
      id: this.postId,
      title: this.form.value.title,
      content: this.form.value.content,
    };
    this.isLoading = true;
    if (this.form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postService.addPost(post);
    } else {
      this.postService.updatePost(post);
    }
    this.form.reset();
  }
}
