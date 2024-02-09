/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  username: string,
  email: string,
  userPublicName?: string | null,
  school?: string | null,
  companyUserId?: string | null,
  isCompanyUser: boolean,
  isOwnCompany: boolean,
  key?: string | null,
};

export type User = {
  __typename: "User",
  id: string,
  username: string,
  userPublicName?: string | null,
  email: string,
  school?: string | null,
  company?: Company | null,
  companyUserId?: string | null,
  isCompanyUser: boolean,
  isOwnCompany: boolean,
  createdAt: string,
  problemCreateCnt: number,
  problemSlvCnt: number,
  isEmailCertification: boolean,
  key?: string | null,
  followers:  Array<User | null >,
  following:  Array<User | null >,
  posts:  Array<Post | null >,
  comments:  Array<Comment | null >,
  likes:  Array<Like | null >,
  messagesSent:  Array<Message | null >,
  messagesReceived:  Array<Message | null >,
};

export type Company = {
  __typename: "Company",
  id: string,
  name: string,
};

export type Post = {
  __typename: "Post",
  id: string,
  user: User,
  content: string,
  createdAt: string,
  updatedAt: string,
  comments:  Array<Comment | null >,
  likes:  Array<Like | null >,
};

export type Comment = {
  __typename: "Comment",
  id: string,
  user: User,
  post: Post,
  content: string,
  createdAt: string,
};

export type Like = {
  __typename: "Like",
  id: string,
  user: User,
  post: Post,
  createdAt: string,
};

export type Message = {
  __typename: "Message",
  id: string,
  sender: User,
  receiver: User,
  message: string,
  timestamp: string,
  isRead: boolean,
  isCompanySend: boolean,
  isSlvWorkbooks?: string | null,
};

export type CreatePostInput = {
  userId: string,
  content: string,
};

export type CreateCommentInput = {
  postId: string,
  userId: string,
  content: string,
};

export type CreateLikeInput = {
  postId: string,
  userId: string,
};

export type Follow = {
  __typename: "Follow",
  id: string,
  follower: User,
  following: User,
  createdAt: string,
};

export type Workbook = {
  __typename: "Workbook",
  id: string,
  workbookName: string,
  description?: string | null,
  createId: User,
  createdAt: string,
  updatedAt: string,
  isPublic: boolean,
  likeCount: number,
  categories:  Array<Category | null >,
  isEdit: boolean,
};

export type Category = {
  __typename: "Category",
  id: string,
  categoryName: string,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    username: string,
    userPublicName?: string | null,
    email: string,
    school?: string | null,
    company?:  {
      __typename: "Company",
      id: string,
      name: string,
    } | null,
    companyUserId?: string | null,
    isCompanyUser: boolean,
    isOwnCompany: boolean,
    createdAt: string,
    problemCreateCnt: number,
    problemSlvCnt: number,
    isEmailCertification: boolean,
    key?: string | null,
    followers:  Array< {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    } | null >,
    following:  Array< {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    } | null >,
    posts:  Array< {
      __typename: "Post",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    comments:  Array< {
      __typename: "Comment",
      id: string,
      content: string,
      createdAt: string,
    } | null >,
    likes:  Array< {
      __typename: "Like",
      id: string,
      createdAt: string,
    } | null >,
    messagesSent:  Array< {
      __typename: "Message",
      id: string,
      message: string,
      timestamp: string,
      isRead: boolean,
      isCompanySend: boolean,
      isSlvWorkbooks?: string | null,
    } | null >,
    messagesReceived:  Array< {
      __typename: "Message",
      id: string,
      message: string,
      timestamp: string,
      isRead: boolean,
      isCompanySend: boolean,
      isSlvWorkbooks?: string | null,
    } | null >,
  } | null,
};

export type CreatePostMutationVariables = {
  input: CreatePostInput,
};

export type CreatePostMutation = {
  createPost?:  {
    __typename: "Post",
    id: string,
    user:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    content: string,
    createdAt: string,
    updatedAt: string,
    comments:  Array< {
      __typename: "Comment",
      id: string,
      content: string,
      createdAt: string,
    } | null >,
    likes:  Array< {
      __typename: "Like",
      id: string,
      createdAt: string,
    } | null >,
  } | null,
};

export type CreateCommentMutationVariables = {
  input: CreateCommentInput,
};

export type CreateCommentMutation = {
  createComment?:  {
    __typename: "Comment",
    id: string,
    user:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    post:  {
      __typename: "Post",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    },
    content: string,
    createdAt: string,
  } | null,
};

export type CreatePostLikeMutationVariables = {
  input: CreateLikeInput,
};

export type CreatePostLikeMutation = {
  createPostLike?:  {
    __typename: "Like",
    id: string,
    user:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    post:  {
      __typename: "Post",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
  } | null,
};

export type FollowUserMutationVariables = {
  followerId: string,
  followingId: string,
};

export type FollowUserMutation = {
  followUser?:  {
    __typename: "Follow",
    id: string,
    follower:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    following:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    createdAt: string,
  } | null,
};

export type SendMessageMutationVariables = {
  senderId: string,
  receiverId: string,
  message: string,
};

export type SendMessageMutation = {
  sendMessage?:  {
    __typename: "Message",
    id: string,
    sender:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    receiver:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    message: string,
    timestamp: string,
    isRead: boolean,
    isCompanySend: boolean,
    isSlvWorkbooks?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    username: string,
    userPublicName?: string | null,
    email: string,
    school?: string | null,
    company?:  {
      __typename: "Company",
      id: string,
      name: string,
    } | null,
    companyUserId?: string | null,
    isCompanyUser: boolean,
    isOwnCompany: boolean,
    createdAt: string,
    problemCreateCnt: number,
    problemSlvCnt: number,
    isEmailCertification: boolean,
    key?: string | null,
    followers:  Array< {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    } | null >,
    following:  Array< {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    } | null >,
    posts:  Array< {
      __typename: "Post",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    comments:  Array< {
      __typename: "Comment",
      id: string,
      content: string,
      createdAt: string,
    } | null >,
    likes:  Array< {
      __typename: "Like",
      id: string,
      createdAt: string,
    } | null >,
    messagesSent:  Array< {
      __typename: "Message",
      id: string,
      message: string,
      timestamp: string,
      isRead: boolean,
      isCompanySend: boolean,
      isSlvWorkbooks?: string | null,
    } | null >,
    messagesReceived:  Array< {
      __typename: "Message",
      id: string,
      message: string,
      timestamp: string,
      isRead: boolean,
      isCompanySend: boolean,
      isSlvWorkbooks?: string | null,
    } | null >,
  } | null,
};

export type ListUsersQueryVariables = {
};

export type ListUsersQuery = {
  listUsers?:  Array< {
    __typename: "User",
    id: string,
    username: string,
    userPublicName?: string | null,
    email: string,
    school?: string | null,
    company?:  {
      __typename: "Company",
      id: string,
      name: string,
    } | null,
    companyUserId?: string | null,
    isCompanyUser: boolean,
    isOwnCompany: boolean,
    createdAt: string,
    problemCreateCnt: number,
    problemSlvCnt: number,
    isEmailCertification: boolean,
    key?: string | null,
    followers:  Array< {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    } | null >,
    following:  Array< {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    } | null >,
    posts:  Array< {
      __typename: "Post",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    comments:  Array< {
      __typename: "Comment",
      id: string,
      content: string,
      createdAt: string,
    } | null >,
    likes:  Array< {
      __typename: "Like",
      id: string,
      createdAt: string,
    } | null >,
    messagesSent:  Array< {
      __typename: "Message",
      id: string,
      message: string,
      timestamp: string,
      isRead: boolean,
      isCompanySend: boolean,
      isSlvWorkbooks?: string | null,
    } | null >,
    messagesReceived:  Array< {
      __typename: "Message",
      id: string,
      message: string,
      timestamp: string,
      isRead: boolean,
      isCompanySend: boolean,
      isSlvWorkbooks?: string | null,
    } | null >,
  } | null > | null,
};

export type GetPostQueryVariables = {
  id: string,
};

export type GetPostQuery = {
  getPost?:  {
    __typename: "Post",
    id: string,
    user:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    content: string,
    createdAt: string,
    updatedAt: string,
    comments:  Array< {
      __typename: "Comment",
      id: string,
      content: string,
      createdAt: string,
    } | null >,
    likes:  Array< {
      __typename: "Like",
      id: string,
      createdAt: string,
    } | null >,
  } | null,
};

export type ListPostsQueryVariables = {
};

export type ListPostsQuery = {
  listPosts?:  Array< {
    __typename: "Post",
    id: string,
    user:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    content: string,
    createdAt: string,
    updatedAt: string,
    comments:  Array< {
      __typename: "Comment",
      id: string,
      content: string,
      createdAt: string,
    } | null >,
    likes:  Array< {
      __typename: "Like",
      id: string,
      createdAt: string,
    } | null >,
  } | null > | null,
};

export type GetCommentQueryVariables = {
  id: string,
};

export type GetCommentQuery = {
  getComment?:  {
    __typename: "Comment",
    id: string,
    user:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    post:  {
      __typename: "Post",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    },
    content: string,
    createdAt: string,
  } | null,
};

export type ListCommentsQueryVariables = {
};

export type ListCommentsQuery = {
  listComments?:  Array< {
    __typename: "Comment",
    id: string,
    user:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    post:  {
      __typename: "Post",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    },
    content: string,
    createdAt: string,
  } | null > | null,
};

export type GetFollowQueryVariables = {
  id: string,
};

export type GetFollowQuery = {
  getFollow?:  {
    __typename: "Follow",
    id: string,
    follower:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    following:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    createdAt: string,
  } | null,
};

export type ListFollowsQueryVariables = {
};

export type ListFollowsQuery = {
  listFollows?:  Array< {
    __typename: "Follow",
    id: string,
    follower:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    following:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    createdAt: string,
  } | null > | null,
};

export type GetMessageQueryVariables = {
  id: string,
};

export type GetMessageQuery = {
  getMessage?:  {
    __typename: "Message",
    id: string,
    sender:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    receiver:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    message: string,
    timestamp: string,
    isRead: boolean,
    isCompanySend: boolean,
    isSlvWorkbooks?: string | null,
  } | null,
};

export type ListMessagesQueryVariables = {
};

export type ListMessagesQuery = {
  listMessages?:  Array< {
    __typename: "Message",
    id: string,
    sender:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    receiver:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    message: string,
    timestamp: string,
    isRead: boolean,
    isCompanySend: boolean,
    isSlvWorkbooks?: string | null,
  } | null > | null,
};

export type GetWorkbookQueryVariables = {
  id: string,
};

export type GetWorkbookQuery = {
  getWorkbook?:  {
    __typename: "Workbook",
    id: string,
    workbookName: string,
    description?: string | null,
    createId:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    isPublic: boolean,
    likeCount: number,
    categories:  Array< {
      __typename: "Category",
      id: string,
      categoryName: string,
    } | null >,
    isEdit: boolean,
  } | null,
};

export type ListWorkbooksQueryVariables = {
};

export type ListWorkbooksQuery = {
  listWorkbooks?:  Array< {
    __typename: "Workbook",
    id: string,
    workbookName: string,
    description?: string | null,
    createId:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    createdAt: string,
    updatedAt: string,
    isPublic: boolean,
    likeCount: number,
    categories:  Array< {
      __typename: "Category",
      id: string,
      categoryName: string,
    } | null >,
    isEdit: boolean,
  } | null > | null,
};

export type GetCategoryQueryVariables = {
  id: string,
};

export type GetCategoryQuery = {
  getCategory?:  {
    __typename: "Category",
    id: string,
    categoryName: string,
  } | null,
};

export type ListCategoriesQueryVariables = {
};

export type ListCategoriesQuery = {
  listCategories?:  Array< {
    __typename: "Category",
    id: string,
    categoryName: string,
  } | null > | null,
};

export type MessageSentSubscriptionVariables = {
  receiverId: string,
};

export type MessageSentSubscription = {
  messageSent?:  {
    __typename: "Message",
    id: string,
    sender:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    receiver:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    message: string,
    timestamp: string,
    isRead: boolean,
    isCompanySend: boolean,
    isSlvWorkbooks?: string | null,
  } | null,
};

export type PostCreatedSubscriptionVariables = {
};

export type PostCreatedSubscription = {
  postCreated?:  {
    __typename: "Post",
    id: string,
    user:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    content: string,
    createdAt: string,
    updatedAt: string,
    comments:  Array< {
      __typename: "Comment",
      id: string,
      content: string,
      createdAt: string,
    } | null >,
    likes:  Array< {
      __typename: "Like",
      id: string,
      createdAt: string,
    } | null >,
  } | null,
};

export type CommentAddedToPostSubscriptionVariables = {
  postId: string,
};

export type CommentAddedToPostSubscription = {
  commentAddedToPost?:  {
    __typename: "Comment",
    id: string,
    user:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    post:  {
      __typename: "Post",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    },
    content: string,
    createdAt: string,
  } | null,
};

export type PostLikedSubscriptionVariables = {
  postId: string,
};

export type PostLikedSubscription = {
  postLiked?:  {
    __typename: "Like",
    id: string,
    user:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    post:  {
      __typename: "Post",
      id: string,
      content: string,
      createdAt: string,
      updatedAt: string,
    },
    createdAt: string,
  } | null,
};

export type UserFollowedSubscriptionVariables = {
  followerId: string,
  followingId: string,
};

export type UserFollowedSubscription = {
  userFollowed?:  {
    __typename: "Follow",
    id: string,
    follower:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    following:  {
      __typename: "User",
      id: string,
      username: string,
      userPublicName?: string | null,
      email: string,
      school?: string | null,
      companyUserId?: string | null,
      isCompanyUser: boolean,
      isOwnCompany: boolean,
      createdAt: string,
      problemCreateCnt: number,
      problemSlvCnt: number,
      isEmailCertification: boolean,
      key?: string | null,
    },
    createdAt: string,
  } | null,
};
