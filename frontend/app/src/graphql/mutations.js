/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      username
      icon
      userPublicName
      email
      school
      company {
        id
        name
        __typename
      }
      companyUserId
      isCompanyUser
      isOwnCompany
      createdAt
      problemCreateCnt
      problemSlvCnt
      isEmailCertification
      key
      followers {
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
      posts {
        id
        content
        createdAt
        updatedAt
        __typename
      }
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
      messagesSent {
        id
        message
        timestamp
        isRead
        isCompanySend
        isSlvWorkbooks
        __typename
      }
      messagesReceived {
        id
        message
        timestamp
        isRead
        isCompanySend
        isSlvWorkbooks
        __typename
      }
      __typename
    }
  }
`;
export const createPost = /* GraphQL */ `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
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
export const createComment = /* GraphQL */ `
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
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
export const createPostLike = /* GraphQL */ `
  mutation CreatePostLike($input: CreateLikeInput!) {
    createPostLike(input: $input) {
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
export const followUser = /* GraphQL */ `
  mutation FollowUser($followerId: ID!, $followingId: ID!) {
    followUser(followerId: $followerId, followingId: $followingId) {
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
export const sendMessage = /* GraphQL */ `
  mutation SendMessage($senderId: ID!, $receiverId: ID!, $message: String!) {
    sendMessage(
      senderId: $senderId
      receiverId: $receiverId
      message: $message
    ) {
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
