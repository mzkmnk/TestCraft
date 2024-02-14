/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers {
    listUsers {
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
export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
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
export const listPosts = /* GraphQL */ `
  query ListPosts {
    listPosts {
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
        user {
          id
        }
        createdAt
        __typename
      }
      __typename
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
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
export const listComments = /* GraphQL */ `
  query ListComments {
    listComments {
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
export const getFollow = /* GraphQL */ `
  query GetFollow($id: ID!) {
    getFollow(id: $id) {
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
export const listFollows = /* GraphQL */ `
  query ListFollows {
    listFollows {
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
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
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
export const listMessages = /* GraphQL */ `
  query ListMessages {
    listMessages {
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
export const getWorkbook = /* GraphQL */ `
  query GetWorkbook($id: ID!) {
    getWorkbook(id: $id) {
      id
      workbookName
      description
      createId {
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
`;
export const listWorkbooks = /* GraphQL */ `
  query ListWorkbooks {
    listWorkbooks {
      id
      workbookName
      description
      createId {
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
`;
export const getCategory = /* GraphQL */ `
  query GetCategory($id: ID!) {
    getCategory(id: $id) {
      id
      categoryName
      __typename
    }
  }
`;
export const listCategories = /* GraphQL */ `
  query ListCategories {
    listCategories {
      id
      categoryName
      __typename
    }
  }
`;
