/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const messageSent = /* GraphQL */ `
  subscription MessageSent($receiverId: ID!) {
    messageSent(receiverId: $receiverId) {
      id
      sender {
        id
        username
        icon
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
        icon
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
`;
export const postCreated = /* GraphQL */ `
  subscription PostCreated {
    postCreated {
      id
      user {
        id
        username
        icon
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
`;
export const commentAddedToPost = /* GraphQL */ `
  subscription CommentAddedToPost($postId: ID!) {
    commentAddedToPost(postId: $postId) {
      id
      user {
        id
        username
        icon
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
`;
export const postLiked = /* GraphQL */ `
  subscription PostLiked($postId: ID!) {
    postLiked(postId: $postId) {
      id
      user {
        id
        username
        icon
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
`;
export const userFollowed = /* GraphQL */ `
  subscription UserFollowed($followerId: ID!, $followingId: ID!) {
    userFollowed(followerId: $followerId, followingId: $followingId) {
      id
      follower {
        id
        username
        icon
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
        icon
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
`;
