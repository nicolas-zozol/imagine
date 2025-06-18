import dotenv from 'dotenv'
import { Tweet, TwitterClient } from '../twitter/twitter-client.js'

dotenv.config()

async function runScriptTwitter() {
  console.log('Running script Twitter...')
  const { TwitterClient } = await import('../twitter/twitter-client.js')
  const userBearer = process.env.TWITTER_BEARER

  if (!userBearer) {
    throw new Error('TWITTER_BEARER is not set')
  }

  const twitterClient = new TwitterClient(userBearer)
  const query = 'MCP server'
  const tweets = await twitterClient.searchSubject(query)
  console.log('Tweets:', tweets)
  console.log('Tweets length:', tweets.length)
}

async function runUserIdsScript() {
  const tweets = getSomeResult()
  const usersIds = tweets.map((tweet) => tweet.author_id)
  const userBearer = process.env.TWITTER_BEARER
  if (!userBearer) {
    throw new Error('TWITTER_BEARER is not set')
  }
  const twitterClient = new TwitterClient(userBearer)
  const users = await twitterClient.searchUserIds(usersIds)
  console.log('Users:', users)
}

runUserIdsScript().catch(console.error)

function getSomeResult(): Tweet[] {
  return [
    {
      author_id: '1606102415840841729',
      id: '1924855884909576560',
      created_at: '2025-05-20T15:52:59.000Z',
      text: 'RT @QU3ai: QU3’s first 10 days delivered MCP server deployment, 600+ devs onboarded for early-access, 4+ partnerships, and a Top 3 launch o…',
      edit_history_tweet_ids: ['1924855884909576560'],
    },
    {
      author_id: '1169726235817185281',
      id: '1924855662208598355',
      created_at: '2025-05-20T15:52:06.000Z',
      text: "RT @yoheinakajima: this might seem like a silly question but if you're setting up remote MCP server(s) for your own AI projects, do you rea…",
      edit_history_tweet_ids: ['1924855662208598355'],
    },
    {
      author_id: '1772644434259181569',
      id: '1924855657607393764',
      created_at: '2025-05-20T15:52:05.000Z',
      text: 'RT @QU3ai: QU3’s first 10 days delivered MCP server deployment, 600+ devs onboarded for early-access, 4+ partnerships, and a Top 3 launch o…',
      edit_history_tweet_ids: ['1924855657607393764'],
    },
    {
      author_id: '1169726235817185281',
      id: '1924855615060316183',
      created_at: '2025-05-20T15:51:55.000Z',
      text: 'RT @nilslice: @crackberrypi use https://t.co/2DsP1DQ3aC profiles to manage this!\n\nnow we support installing remote mcp servers into your pr…',
      edit_history_tweet_ids: ['1924855615060316183'],
    },
    {
      author_id: '13014642',
      id: '1924855591828132303',
      created_at: '2025-05-20T15:51:49.000Z',
      text: 'Install an MCP server in the Warp terminal\nhttps://t.co/W9JOWYOdxB https://t.co/yUtbWoBzYm',
      edit_history_tweet_ids: ['1924855591828132303'],
    },
    {
      author_id: '30346657',
      id: '1924854691416129552',
      created_at: '2025-05-20T15:48:15.000Z',
      text: '@VibeSlav Hmm. How would get an agent to use a database exposed via http endpoints?\n\nAt some point it seems like describing how to use the endpoints and the structure of the data would be more work that creating an mcp server.',
      edit_history_tweet_ids: ['1924854691416129552'],
    },
    {
      author_id: '1169726235817185281',
      id: '1924854490244562966',
      created_at: '2025-05-20T15:47:27.000Z',
      text: 'RT @BitMindAI: The BitMind Intelligence Oracle MCP Server is live!\n\nNow you can access multiple Bittensor subnets inside a single LLM  with…',
      edit_history_tweet_ids: ['1924854490244562966'],
    },
    {
      author_id: '98930914',
      id: '1924854268164743496',
      created_at: '2025-05-20T15:46:34.000Z',
      text: 'RT @svpino: I added a Knowledge Graph to Cursor using MCP.\n\nYou gotta see this working!\n\nKnowledge graphs are a game-changer for AI Agents,…',
      edit_history_tweet_ids: ['1924854268164743496'],
    },
    {
      author_id: '34717199',
      id: '1924853893239812317',
      created_at: '2025-05-20T15:45:04.000Z',
      text: '1/ 🧵 Novidades quentinhas no ar: O Blueprint Prompts agora tem MCP Server rodando via Docker com UM comando só. 🐳\n\nServe seus prompts direto pro Cursor ou qualquer agente IA.\n\n#blueprintprompts #devtools https://t.co/GXiyIncjB2',
      edit_history_tweet_ids: ['1924853893239812317'],
    },
    {
      author_id: '164099066',
      id: '1924853714906677642',
      created_at: '2025-05-20T15:44:22.000Z',
      text: 'RT @Neuron_World: Excited to demo our recent integration with @hedera HCS-10 and @MoonscapeLabs, enabling Hedera AI agents to buy @SkyX_Net…',
      edit_history_tweet_ids: ['1924853714906677642'],
    },
    {
      author_id: '16982689',
      id: '1924853702592249957',
      created_at: '2025-05-20T15:44:19.000Z',
      text: '@kentcdodds Simplest, most reliable, way is to support making an api key on the server and then letting the user set that on the clients config for the MCP server. OAuth will have more iterations and cases, but an APi key fallback isn’t going to go away.',
      edit_history_tweet_ids: ['1924853702592249957'],
    },
    {
      author_id: '1268572954641813504',
      id: '1924853594005680371',
      created_at: '2025-05-20T15:43:53.000Z',
      text: 'RT @Neuron_World: Excited to demo our recent integration with @hedera HCS-10 and @MoonscapeLabs, enabling Hedera AI agents to buy @SkyX_Net…',
      edit_history_tweet_ids: ['1924853594005680371'],
    },
    {
      author_id: '266849265',
      id: '1924853453328621604',
      created_at: '2025-05-20T15:43:19.000Z',
      text: 'RT @Neuron_World: Excited to demo our recent integration with @hedera HCS-10 and @MoonscapeLabs, enabling Hedera AI agents to buy @SkyX_Net…',
      edit_history_tweet_ids: ['1924853453328621604'],
    },
    {
      author_id: '1611846294288343042',
      id: '1924853118761894032',
      created_at: '2025-05-20T15:42:00.000Z',
      text: 'RT @YinsenHe: Cherry Studio  v 1.3.7 又发布了， 主要内容：更新 MCP SDK\n升级 Electron 至 35.2.2，\n功能：新增引用列表右键复制功能\n功能：支持备份时跳过文件\n功能：通过 JSON 快速添加 MCP  server…',
      edit_history_tweet_ids: ['1924853118761894032'],
    },
    {
      author_id: '1012969945393762304',
      id: '1924853003733119152',
      created_at: '2025-05-20T15:41:32.000Z',
      text: "Native support for MCP in Windows! 🤯\n\nEssentially an MCP server which access to windows like capabilities!\n\nIt doesn't end there, developers can build Windows apps that can be used as MCPs by other apps on Windows!\n\nThis does bring the agentic web into reality!\n\nYou can https://t.co/VjxAbNbymM",
      edit_history_tweet_ids: ['1924853003733119152'],
    },
    {
      author_id: '807911881',
      id: '1924851955136135661',
      created_at: '2025-05-20T15:37:22.000Z',
      text: 'RT @akshay_pachaar: INCREDIBLE!! An MCP server to browse the web like humans!\n\nBright Data MCP server provides 30+ powerful tools that allo…',
      edit_history_tweet_ids: ['1924851955136135661'],
    },
    {
      author_id: '807911881',
      id: '1924851566525481077',
      created_at: '2025-05-20T15:35:50.000Z',
      text: 'RT @iannuttall: my mcp server boilerplate is now free + open source \n(just refunded all orders)\n\n- auth users with google/github\n- host on…',
      edit_history_tweet_ids: ['1924851566525481077'],
    },
    {
      author_id: '531010804',
      id: '1924851435382177953',
      created_at: '2025-05-20T15:35:18.000Z',
      text: 'RT @koki_develop: おお、公式から Terraform の MCP サーバー出た\n\nhttps://t.co/11cQHP3xOZ',
      edit_history_tweet_ids: ['1924851435382177953'],
    },
    {
      author_id: '1266991462941483009',
      id: '1924851340418941375',
      created_at: '2025-05-20T15:34:56.000Z',
      text: 'RT @_avichawla: An MCP server to create @3blue1brown animations (open-source): https://t.co/gC8o5AWCpw',
      edit_history_tweet_ids: ['1924851340418941375'],
    },
    {
      author_id: '1266991462941483009',
      id: '1924851305304207412',
      created_at: '2025-05-20T15:34:47.000Z',
      text: "RT @yoheinakajima: this might seem like a silly question but if you're setting up remote MCP server(s) for your own AI projects, do you rea…",
      edit_history_tweet_ids: ['1924851305304207412'],
    },
    {
      author_id: '1910146006316195840',
      id: '1924851171392684099',
      created_at: '2025-05-20T15:34:15.000Z',
      text: 'RT @SmartCryptoNew1: 🔒 @QU3ai brings quantum-secure #Web3! Post-quantum crypto, AI, &amp; inter-chain routing for fast, verified compute. \n\n🛡️…',
      edit_history_tweet_ids: ['1924851171392684099'],
    },
    {
      author_id: '1682428283135336449',
      id: '1924851090438365224',
      created_at: '2025-05-20T15:33:56.000Z',
      text: 'Here is a better picture of the Native MCP server for Windows.  I suspect you can not only use WinOS Native MCP for your local agents but use the new NLWeb protocol to connect external Agents to a local protected (behind firewall) website securely using the MCP Proxy! BIG NEWS. https://t.co/c06bzNE9LB',
      edit_history_tweet_ids: ['1924850969155928529', '1924851090438365224'],
    },
    {
      author_id: '1682428283135336449',
      id: '1924850969155928529',
      created_at: '2025-05-20T15:33:27.000Z',
      text: 'Here is a better picture of the Native MCP server for Windows.  I suspect you can not only use WinOS Native MCP for your local agents but use the new NLWeb protocol to connect external Agents to a local protected (behind firewall) website securing using the MCP Proxy! BIG NEWS. https://t.co/6j67rseH6Q',
      edit_history_tweet_ids: ['1924850969155928529', '1924851090438365224'],
    },
    {
      author_id: '1890856592746123265',
      id: '1924850543706448243',
      created_at: '2025-05-20T15:31:46.000Z',
      text: 'RT @0rdlibrary: Will be forking this live today.\n\nAnd completely making it for @solana ai.\n\nI will be adding my X402 protocol tech.\n\nAs wel…',
      edit_history_tweet_ids: ['1924850543706448243'],
    },
    {
      author_id: '55999612',
      id: '1924850490656895272',
      created_at: '2025-05-20T15:31:33.000Z',
      text: 'Terraform MCP Server (HashiCorp社) 使ってみた | DevelopersIO\n\nはてなブックマーク テクノロジー新着\n\nhttps://t.co/JvKedARhaU',
      edit_history_tweet_ids: ['1924850490656895272'],
    },
    {
      author_id: '3094201',
      id: '1924850382280261804',
      created_at: '2025-05-20T15:31:07.000Z',
      text: '@jsngr https://t.co/1dqn9FV3kv has beginnings of one with their MCP server.  I had asked for something similar https://t.co/UGV1wMJCBm',
      edit_history_tweet_ids: ['1924850382280261804'],
    },
    {
      author_id: '1736032611015725056',
      id: '1924850293969227798',
      created_at: '2025-05-20T15:30:46.000Z',
      text: "Discover how Shiprocket is revolutionizing e-commerce for D2C brands &amp; MSMEs with India's first AI-integrated context protocol server, pushing towards fully autonomous operations!    https://t.co/6Yq5yCCMJ2 https://t.co/Zj8UBfQ21q",
      edit_history_tweet_ids: ['1924850293969227798'],
    },
    {
      author_id: '1904445383507591168',
      id: '1924850101241184520',
      created_at: '2025-05-20T15:30:00.000Z',
      text: 'Bright Data’s MCP server: 30+ tools to browse the web like humans! 🌐🚀 100% open-source, scales with 150M+ IPs. No blocks, just data! What’s your MCP use case? 🌟\n\n #BrightDataMCP #AIAgents #WebData  @akshay_pachaar https://t.co/H7417sfObK',
      edit_history_tweet_ids: ['1924850101241184520'],
    },
    {
      author_id: '1749684867548475392',
      id: '1924849966826324127',
      created_at: '2025-05-20T15:29:28.000Z',
      text: 'RT @SmartCryptoNew1: 🔒 @QU3ai brings quantum-secure #Web3! Post-quantum crypto, AI, &amp; inter-chain routing for fast, verified compute. \n\n🛡️…',
      edit_history_tweet_ids: ['1924849966826324127'],
    },
    {
      author_id: '850617956220502016',
      id: '1924849910551068724',
      created_at: '2025-05-20T15:29:15.000Z',
      text: 'RT @_avichawla: An MCP server to create @3blue1brown animations (open-source): https://t.co/gC8o5AWCpw',
      edit_history_tweet_ids: ['1924849910551068724'],
    },
    {
      author_id: '1510297600695705608',
      id: '1924849852053070102',
      created_at: '2025-05-20T15:29:01.000Z',
      text: 'RT @Neuron_World: Excited to demo our recent integration with @hedera HCS-10 and @MoonscapeLabs, enabling Hedera AI agents to buy @SkyX_Net…',
      edit_history_tweet_ids: ['1924849852053070102'],
    },
    {
      author_id: '1779904354574532608',
      id: '1924849651125256534',
      created_at: '2025-05-20T15:28:13.000Z',
      text: "Diving deeper into our MCP Server build! One of the first hurdles? Python SDK limitations for our auth needs. Here's why we pivoted to TypeScript &amp; OAuth for @realPortalOne: https://t.co/WPprvvZVeB \n\n#MCPserver #AI #TypeScript #PortalOne https://t.co/AArLObAHIB",
      edit_history_tweet_ids: ['1924849651125256534'],
    },
    {
      author_id: '1810998361442398208',
      id: '1924849199796961791',
      created_at: '2025-05-20T15:26:25.000Z',
      text: 'RT @Neuron_World: Excited to demo our recent integration with @hedera HCS-10 and @MoonscapeLabs, enabling Hedera AI agents to buy @SkyX_Net…',
      edit_history_tweet_ids: ['1924849199796961791'],
    },
    {
      author_id: '4873281',
      id: '1924849126795313625',
      created_at: '2025-05-20T15:26:08.000Z',
      text: 'RT @koki_develop: おお、公式から Terraform の MCP サーバー出た\n\nhttps://t.co/11cQHP3xOZ',
      edit_history_tweet_ids: ['1924849126795313625'],
    },
    {
      author_id: '1189588301209993217',
      id: '1924849120642232671',
      created_at: '2025-05-20T15:26:06.000Z',
      text: 'RT @iannuttall: my mcp server boilerplate is now free + open source \n(just refunded all orders)\n\n- auth users with google/github\n- host on…',
      edit_history_tweet_ids: ['1924849120642232671'],
    },
    {
      author_id: '778570044955430912',
      id: '1924848823832347028',
      created_at: '2025-05-20T15:24:56.000Z',
      text: 'WindowsのMCP Server機能とか、クライアントとしてMCP経由でWindowsを操作して色々とやるマルウェアが出てきそうだよな。\n\nその辺、大丈夫なのかね？\n\nだって、MCPクライアントなんて、LLMとか無くても成り立つ代物だから、単純にOSを操作する規格化された口が増えるってだけとも言えてしまうんだよな',
      edit_history_tweet_ids: ['1924848823832347028'],
    },
    {
      author_id: '1705804887970496512',
      id: '1924848303554089429',
      created_at: '2025-05-20T15:22:52.000Z',
      text: 'RT @empe_io: Empeiria Drops the World’s First MCP Web3 Trust Layer\n\nMCP (Machine Context Protocol) Empe Server provides tools for interacti…',
      edit_history_tweet_ids: ['1924848303554089429'],
    },
    {
      author_id: '892254450',
      id: '1924848294301516098',
      created_at: '2025-05-20T15:22:49.000Z',
      text: 'RT @jasonzhou1993: MCP clearly has demand,\nBut monetizing it has been tricky.\n\nI figured out the easiest way to build &amp; monetize a Paid MCP…',
      edit_history_tweet_ids: ['1924848294301516098'],
    },
    {
      author_id: '252550038',
      id: '1924848135089881421',
      created_at: '2025-05-20T15:22:12.000Z',
      text: 'RT @jasonzhou1993: MCP clearly has demand,\nBut monetizing it has been tricky.\n\nI figured out the easiest way to build &amp; monetize a Paid MCP…',
      edit_history_tweet_ids: ['1924848135089881421'],
    },
    {
      author_id: '1613897601354731527',
      id: '1924848113875066984',
      created_at: '2025-05-20T15:22:06.000Z',
      text: '@SmartCryptoNew1 @QU3ai The quantum-safe MCP Server running AI models in encrypted enclaves offers unparalleled security for sensitive workloads. Broadcasting tamper-proof results to any blockchain is a significant advancement.',
      edit_history_tweet_ids: ['1924848113875066984'],
    },
    {
      author_id: '953919675431190529',
      id: '1924848044421365860',
      created_at: '2025-05-20T15:21:50.000Z',
      text: 'RT @Neuron_World: Excited to demo our recent integration with @hedera HCS-10 and @MoonscapeLabs, enabling Hedera AI agents to buy @SkyX_Net…',
      edit_history_tweet_ids: ['1924848044421365860'],
    },
    {
      author_id: '1740767181321777152',
      id: '1924847959218295093',
      created_at: '2025-05-20T15:21:30.000Z',
      text: 'RT @0rdlibrary: Will be forking this live today.\n\nAnd completely making it for @solana ai.\n\nI will be adding my X402 protocol tech.\n\nAs wel…',
      edit_history_tweet_ids: ['1924847959218295093'],
    },
    {
      author_id: '252550038',
      id: '1924847824321315067',
      created_at: '2025-05-20T15:20:57.000Z',
      text: 'RT @iannuttall: my mcp server boilerplate is now free + open source \n(just refunded all orders)\n\n- auth users with google/github\n- host on…',
      edit_history_tweet_ids: ['1924847824321315067'],
    },
    {
      author_id: '2456825562',
      id: '1924847778141757933',
      created_at: '2025-05-20T15:20:46.000Z',
      text: 'RT @0rdlibrary: Will be forking this live today.\n\nAnd completely making it for @solana ai.\n\nI will be adding my X402 protocol tech.\n\nAs wel…',
      edit_history_tweet_ids: ['1924847778141757933'],
    },
    {
      author_id: '1265393460669898758',
      id: '1924847682486784043',
      created_at: '2025-05-20T15:20:24.000Z',
      text: 'RT @0rdlibrary: Will be forking this live today.\n\nAnd completely making it for @solana ai.\n\nI will be adding my X402 protocol tech.\n\nAs wel…',
      edit_history_tweet_ids: ['1924847682486784043'],
    },
    {
      author_id: '1850871667758678016',
      id: '1924847566568484899',
      created_at: '2025-05-20T15:19:56.000Z',
      text: 'RT @0rdlibrary: Will be forking this live today.\n\nAnd completely making it for @solana ai.\n\nI will be adding my X402 protocol tech.\n\nAs wel…',
      edit_history_tweet_ids: ['1924847566568484899'],
    },
    {
      author_id: '1256993463243079682',
      id: '1924847556271489292',
      created_at: '2025-05-20T15:19:54.000Z',
      text: 'RT @akshay_pachaar: INCREDIBLE!! An MCP server to browse the web like humans!\n\nBright Data MCP server provides 30+ powerful tools that allo…',
      edit_history_tweet_ids: ['1924847556271489292'],
    },
    {
      author_id: '14864055',
      id: '1924847114288296241',
      created_at: '2025-05-20T15:18:08.000Z',
      text: "I started using @dariogriffo 's Postgres Memory MCP server last night and I adjusted my system prompts in Cursor to leverage it heavily. \n\nClaude / Gemini really short-change themselves by writing really tiny memories by default. I need to adjust so they include richer context",
      edit_history_tweet_ids: ['1924847114288296241'],
    },
    {
      author_id: '818900155',
      id: '1924847009837781064',
      created_at: '2025-05-20T15:17:43.000Z',
      text: 'RT @Neuron_World: Excited to demo our recent integration with @hedera HCS-10 and @MoonscapeLabs, enabling Hedera AI agents to buy @SkyX_Net…',
      edit_history_tweet_ids: ['1924847009837781064'],
    },
    {
      author_id: '52672213',
      id: '1924846852358472195',
      created_at: '2025-05-20T15:17:06.000Z',
      text: 'RT @iannuttall: my mcp server boilerplate is now free + open source \n(just refunded all orders)\n\n- auth users with google/github\n- host on…',
      edit_history_tweet_ids: ['1924846852358472195'],
    },
    {
      author_id: '2823009315',
      id: '1924846728571658499',
      created_at: '2025-05-20T15:16:36.000Z',
      text: 'RT @akshay_pachaar: Unlike typical scraping tools, this MCP server dynamically picks the most effective tool based on the structure of the…',
      edit_history_tweet_ids: ['1924846728571658499'],
    },
    {
      author_id: '1871934987005546496',
      id: '1924846709232042228',
      created_at: '2025-05-20T15:16:32.000Z',
      text: "RT @Neuron_World: @coinbase's x402 standard, made it easy for AI agents to purchase services from trusted MCP servers\n\nWith Neuron's upgrad…",
      edit_history_tweet_ids: ['1924846709232042228'],
    },
    {
      author_id: '1871934987005546496',
      id: '1924846683575419221',
      created_at: '2025-05-20T15:16:25.000Z',
      text: 'RT @Neuron_World: Excited to demo our recent integration with @hedera HCS-10 and @MoonscapeLabs, enabling Hedera AI agents to buy @SkyX_Net…',
      edit_history_tweet_ids: ['1924846683575419221'],
    },
    {
      author_id: '1723999359635709952',
      id: '1924846632677277822',
      created_at: '2025-05-20T15:16:13.000Z',
      text: 'Will be forking this live today.\n\nAnd completely making it for @solana ai.\n\nI will be adding my X402 protocol tech.\n\nAs well as debut $alice token as the payment.\n\nMeaning this will become:\n\n@solana ‘s first monetized MCP server.\n\nPowered by $alice https://t.co/iblYsmzvQc https://t.co/NZqD2ROdIC',
      edit_history_tweet_ids: ['1924846632677277822'],
    },
    {
      author_id: '784008',
      id: '1924846491509916023',
      created_at: '2025-05-20T15:15:40.000Z',
      text: '@NicerInPerson You can use any MCP server with Amp very easily. MCP support has been in since day 1. The code for Amp is not open source.',
      edit_history_tweet_ids: ['1924846491509916023'],
    },
    {
      author_id: '1488285594648203268',
      id: '1924846382428418233',
      created_at: '2025-05-20T15:15:14.000Z',
      text: 'RT @Neuron_World: Excited to demo our recent integration with @hedera HCS-10 and @MoonscapeLabs, enabling Hedera AI agents to buy @SkyX_Net…',
      edit_history_tweet_ids: ['1924846382428418233'],
    },
    {
      author_id: '1712659848922587136',
      id: '1924846307312861319',
      created_at: '2025-05-20T15:14:56.000Z',
      text: '@supabase @tambo_ai connect to the mcp server and register my components like this: https://t.co/Yuml9hjVSX',
      edit_history_tweet_ids: ['1924846307312861319'],
    },
    {
      author_id: '1919376794643218432',
      id: '1924846225704071591',
      created_at: '2025-05-20T15:14:36.000Z',
      text: "RT @Infoxicador: Don't tell me I didn't tell you\n\nThe Postman API network has 100K+ APIs you can explore and use. \n\nNow we also have an MCP…",
      edit_history_tweet_ids: ['1924846225704071591'],
    },
    {
      author_id: '1767299461561122816',
      id: '1924846189217746951',
      created_at: '2025-05-20T15:14:28.000Z',
      text: 'RT @Neuron_World: Excited to demo our recent integration with @hedera HCS-10 and @MoonscapeLabs, enabling Hedera AI agents to buy @SkyX_Net…',
      edit_history_tweet_ids: ['1924846189217746951'],
    },
    {
      author_id: '1712659848922587136',
      id: '1924845980064874768',
      created_at: '2025-05-20T15:13:38.000Z',
      text: 'MCP is changing how I think about building web apps\n\nI made this "chat with your supabase" app with almost no custom code\n\n- supabase interaction logic from @supabase\'s MCP server\n- register react components as UI tools using @tambo_ai \n\nall I had to do was build the components https://t.co/h7PuLhVnWp',
      edit_history_tweet_ids: ['1924845980064874768'],
    },
    {
      author_id: '2193403644',
      id: '1924845712849670230',
      created_at: '2025-05-20T15:12:34.000Z',
      text: 'RT @Hesamation: i actually didn’t know @AnthropicAI and @DeepLearningAI released a free course on MCP:\n&gt; MCP basics and architecture \n&gt; bui…',
      edit_history_tweet_ids: ['1924845712849670230'],
    },
    {
      author_id: '1804438951224119297',
      id: '1924845619165667487',
      created_at: '2025-05-20T15:12:12.000Z',
      text: 'RT @bruteforce_code: Update on our Web3 Trust Guard MCP Server! @DeMCP_AI  \n\nI just built a desktop-ready file you can install and run loca…',
      edit_history_tweet_ids: ['1924845619165667487'],
    },
    {
      author_id: '344084069',
      id: '1924845521791004709',
      created_at: '2025-05-20T15:11:48.000Z',
      text: '必然的にMCP Serverがきた。BizApps系の皆さんには大事な内容です。一読くださいませ。\n\nhttps://t.co/HlyXMLYOWd',
      edit_history_tweet_ids: ['1924845521791004709'],
    },
    {
      author_id: '1673427062466527233',
      id: '1924845444464521483',
      created_at: '2025-05-20T15:11:30.000Z',
      text: 'RT @0rdlibrary: Last night I made a @Pontifex @elizaOS agent.\n\nThe holy father will be greeting us in wonderland.\n\nUsing a @Blender &amp; @hype…',
      edit_history_tweet_ids: ['1924845444464521483'],
    },
    {
      author_id: '1352277322808881154',
      id: '1924845366165348738',
      created_at: '2025-05-20T15:11:11.000Z',
      text: 'RT @Neuron_World: Excited to demo our recent integration with @hedera HCS-10 and @MoonscapeLabs, enabling Hedera AI agents to buy @SkyX_Net…',
      edit_history_tweet_ids: ['1924845366165348738'],
    },
    {
      author_id: '1292624615156658178',
      id: '1924845066411012528',
      created_at: '2025-05-20T15:10:00.000Z',
      text: 'RT @iannuttall: my mcp server boilerplate is now free + open source \n(just refunded all orders)\n\n- auth users with google/github\n- host on…',
      edit_history_tweet_ids: ['1924845066411012528'],
    },
    {
      author_id: '27875511',
      id: '1924845052192264615',
      created_at: '2025-05-20T15:09:56.000Z',
      text: 'RT @0rdlibrary: Last night I made a @Pontifex @elizaOS agent.\n\nThe holy father will be greeting us in wonderland.\n\nUsing a @Blender &amp; @hype…',
      edit_history_tweet_ids: ['1924845052192264615'],
    },
    {
      author_id: '1226499420537131008',
      id: '1924845015856984538',
      created_at: '2025-05-20T15:09:48.000Z',
      text: "@coinbase's x402 standard, made it easy for AI agents to purchase services from trusted MCP servers\n\nWith Neuron's upgrade AI agents can buy services from any MCP server. Because of our validator network, no trust is needed, and all purchases are protected with guarantees 🚀",
      edit_history_tweet_ids: ['1924845015856984538'],
    },
    {
      author_id: '1226499420537131008',
      id: '1924845013747245503',
      created_at: '2025-05-20T15:09:47.000Z',
      text: 'Excited to demo our recent integration with @hedera HCS-10 and @MoonscapeLabs, enabling Hedera AI agents to buy @SkyX_Network  weather data via their MCP server with just a wallet and some @USDC https://t.co/gRJx51vthx',
      edit_history_tweet_ids: ['1924845013747245503'],
    },
    {
      author_id: '9494442',
      id: '1924844765066969364',
      created_at: '2025-05-20T15:08:48.000Z',
      text: 'RT @iannuttall: my mcp server boilerplate is now free + open source \n(just refunded all orders)\n\n- auth users with google/github\n- host on…',
      edit_history_tweet_ids: ['1924844765066969364'],
    },
  ]
}
