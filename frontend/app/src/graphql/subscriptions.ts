/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const messageSent = /* GraphQL */ `subscription MessageSent($receiverId: ID!) {
  messageSent(receiverId: $receiverId) {
    id
    sender {
      id
      username
      userPublicName
      email
      school
      companyUserId
      isCompanyUser
      isOwnCompany
      createdAt
      problemCreateCnt
      problemSlvCnt
      isEmailCertification
      key
      __typename
    }
    receiver {
      id
      username
      userPublicName
      email
      school
      companyUserId
      isCompanyUser
      isOwnCompany
      createdAt
      problemCreateCnt
      problemSlvCnt
      isEmailCertification
      key
      __typename
    }
    message
    timestamp
    isRead
    isCompanySend
    isSlvWorkbooks
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.MessageSentSubscriptionVariables,
  APITypes.MessageSentSubscription
>;
export const postCreated = /* GraphQL */ `subscription PostCreated {
  postCreated {
    id
    user {
      id
      username
      userPublicName
      email
      school
      companyUserId
      isCompanyUser
      isOwnCompany
      createdAt
      problemCreateCnt
      problemSlvCnt
      isEmailCertification
      key
      __typename
    }
    content
    createdAt
    updatedAt
    comments {
      id
      content
      createdAt
      __typename
    }
    likes {
      id
      createdAt
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.PostCreatedSubscriptionVariables,
  APITypes.PostCreatedSubscription
>;
export const commentAddedToPost = /* GraphQL */ `subscription CommentAddedToPost($postId: ID!) {
  commentAddedToPost(postId: $postId) {
    id
    user {
      id
      username
      userPublicName
      email
      school
      companyUserId
      isCompanyUser
      isOwnCompany
      createdAt
      problemCreateCnt
      problemSlvCnt
      isEmailCertification
      key
      __typename
    }
    post {
      id
      content
      createdAt
      updatedAt
      __typename
    }
    content
    createdAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.CommentAddedToPostSubscriptionVariables,
  APITypes.CommentAddedToPostSubscription
>;
export const postLiked = /* GraphQL */ `subscription PostLiked($postId: ID!) {
  postLiked(postId: $postId) {
    id
    user {
      id
      username
      userPublicName
      email
      school
      companyUserId
      isCompanyUser
      isOwnCompany
      createdAt
      problemCreateCnt
      problemSlvCnt
      isEmailCertification
      key
      __typename
    }
    post {
      id
      content
      createdAt
      updatedAt
      __typename
    }
    createdAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.PostLikedSubscriptionVariables,
  APITypes.PostLikedSubscription
>;
export const userFollowed = /* GraphQL */ `subscription UserFollowed($followerId: ID!, $followingId: ID!) {
  userFollowed(followerId: $followerId, followingId: $followingId) {
    id
    follower {
      id
      username
      userPublicName
      email
      school
      companyUserId
      isCompanyUser
      isOwnCompany
      createdAt
      problemCreateCnt
      problemSlvCnt
      isEmailCertification
      key
      __typename
    }
    following {
      id
      username
      userPublicName
      email
      school
      companyUserId
      isCompanyUser
      isOwnCompany
      createdAt
      problemCreateCnt
      problemSlvCnt
      isEmailCertification
      key
      __typename
    }
    createdAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.UserFollowedSubscriptionVariables,
  APITypes.UserFollowedSubscription
>;
