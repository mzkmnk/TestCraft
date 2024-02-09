/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    username
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
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listUsers = /* GraphQL */ `query ListUsers {
  listUsers {
    id
    username
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
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const getPost = /* GraphQL */ `query GetPost($id: ID!) {
  getPost(id: $id) {
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
` as GeneratedQuery<APITypes.GetPostQueryVariables, APITypes.GetPostQuery>;
export const listPosts = /* GraphQL */ `query ListPosts {
  listPosts {
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
` as GeneratedQuery<APITypes.ListPostsQueryVariables, APITypes.ListPostsQuery>;
export const getComment = /* GraphQL */ `query GetComment($id: ID!) {
  getComment(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetCommentQueryVariables,
  APITypes.GetCommentQuery
>;
export const listComments = /* GraphQL */ `query ListComments {
  listComments {
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
` as GeneratedQuery<
  APITypes.ListCommentsQueryVariables,
  APITypes.ListCommentsQuery
>;
export const getFollow = /* GraphQL */ `query GetFollow($id: ID!) {
  getFollow(id: $id) {
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
` as GeneratedQuery<APITypes.GetFollowQueryVariables, APITypes.GetFollowQuery>;
export const listFollows = /* GraphQL */ `query ListFollows {
  listFollows {
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
` as GeneratedQuery<
  APITypes.ListFollowsQueryVariables,
  APITypes.ListFollowsQuery
>;
export const getMessage = /* GraphQL */ `query GetMessage($id: ID!) {
  getMessage(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMessageQueryVariables,
  APITypes.GetMessageQuery
>;
export const listMessages = /* GraphQL */ `query ListMessages {
  listMessages {
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
` as GeneratedQuery<
  APITypes.ListMessagesQueryVariables,
  APITypes.ListMessagesQuery
>;
export const getWorkbook = /* GraphQL */ `query GetWorkbook($id: ID!) {
  getWorkbook(id: $id) {
    id
    workbookName
    description
    createId {
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
    updatedAt
    isPublic
    likeCount
    categories {
      id
      categoryName
      __typename
    }
    isEdit
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetWorkbookQueryVariables,
  APITypes.GetWorkbookQuery
>;
export const listWorkbooks = /* GraphQL */ `query ListWorkbooks {
  listWorkbooks {
    id
    workbookName
    description
    createId {
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
    updatedAt
    isPublic
    likeCount
    categories {
      id
      categoryName
      __typename
    }
    isEdit
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListWorkbooksQueryVariables,
  APITypes.ListWorkbooksQuery
>;
export const getCategory = /* GraphQL */ `query GetCategory($id: ID!) {
  getCategory(id: $id) {
    id
    categoryName
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetCategoryQueryVariables,
  APITypes.GetCategoryQuery
>;
export const listCategories = /* GraphQL */ `query ListCategories {
  listCategories {
    id
    categoryName
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCategoriesQueryVariables,
  APITypes.ListCategoriesQuery
>;
