import dotenv from 'dotenv'
import { XClient } from '../homemade/x/x-client.js'

dotenv.config()

console.log('>>>>>', process.env['TWITTER_API_IO_KEY'])

async function readTweets(query: string) {
  const twitterClient = new XClient()

  const tweets = await twitterClient.search(query)

  console.log('Tweets:', tweets)
}

const q1 = 'Piastri lang:en min_faves:10 -min_replies:30'

readTweets(q1)
  .then(() => console.log('Done'))
  .catch((err) => console.error('Error:', err))
