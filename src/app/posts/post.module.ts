import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material.module';

import { CreatePostsComponent } from './create-posts/create-posts.component';
import { PostsListComponent } from './posts-list/posts-list.component';

@NgModule({
  declarations: [CreatePostsComponent, PostsListComponent],
  imports: [
    AngularMaterialModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  exports: [CreatePostsComponent, PostsListComponent],
})
export class PostModule {}
