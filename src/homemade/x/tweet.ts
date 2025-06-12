export interface Tweet {
  type: 'tweet'
  id: string
  url: string
  text: string
  source: string
  retweetCount: number
  replyCount: number
  likeCount: number
  quoteCount: number
  viewCount: number
  createdAt: string
  lang: string
  bookmarkCount: number
  isReply: boolean
  inReplyToId?: string
  conversationId: string
  inReplyToUserId?: string
  inReplyToUsername?: string
  author: User
  entities: TweetEntities
  quoted_tweet?: Tweet
  retweeted_tweet?: Tweet
}

export interface Reply {
  type: 'reply'
  tweet_id: string
  text: string
}

export interface User {
  type: 'user'
  userName: string
  url: string
  id: string
  name: string
  isBlueVerified: boolean
  verifiedType: string
  profilePicture: string
  coverPicture: string
  description: string
  location: string
  followers: number
  following: number
  canDm: boolean
  createdAt: string
  favouritesCount: number
  hasCustomTimelines: boolean
  isTranslator: boolean
  mediaCount: number
  statusesCount: number
  withheldInCountries: string[]
  affiliatesHighlightedLabel: Record<string, unknown>
  possiblySensitive: boolean
  pinnedTweetIds: string[]
  isAutomated: boolean
  automatedBy: string
  unavailable: boolean
  message: string
  unavailableReason: string
  profile_bio: UserProfileBio
}

export interface UserProfileBio {
  description: string
  entities: UserBioEntities
}

export interface UserBioEntities {
  description: {
    urls: EntityUrl[]
  }
  url: {
    urls: EntityUrl[]
  }
}

export interface EntityUrl {
  display_url: string
  expanded_url: string
  indices: number[]
  url: string
}

export interface TweetEntities {
  hashtags: Hashtag[]
  urls: EntityUrl[]
  user_mentions: UserMention[]
}

export interface Hashtag {
  indices: number[]
  text: string
}

export interface UserMention {
  id_str: string
  name: string
  screen_name: string
}

export interface TwitterApiResponse {
  tweets: Tweet[]
  has_next_page: boolean
  next_cursor: string
  status: 'success' | 'error'
  message: string
}
