/* ============================================================
   MATRIX MYSTERY MANIA (3M) — Question Data
   Edit this file to add/remove/fix questions. No other file
   needs to change when you update content here.
   ============================================================ */

/* ---------- ROUND 1 — LOGO RECOGNITION ----------
   Player sees the OLD logo and must type the brand name.
   Accepted answers are checked case-insensitively, ignoring
   punctuation/spacing, against "brand" plus any "aliases".
   "newFile" is the brand's NEW logo, revealed in the round-end
   review screen alongside the correct answer.
*/
const ROUND1_LOGOS = [
  { file: "assets/logos/maruti-suzuki.jpg", newFile: "assets/logos/maruti-suzuki-new.jpg", brand: "Maruti Suzuki", aliases: ["Maruti", "Suzuki"], category: "automobile" },
  { file: "assets/logos/american-airlines.jpg", newFile: "assets/logos/american-airlines-new.png", brand: "American Airlines", aliases: ["American"], category: "airline" },
  { file: "assets/logos/firefox.jpg", newFile: "assets/logos/firefox-new.png", brand: "Mozilla Firefox", aliases: ["Firefox", "Mozilla"], category: "tech" },
  { file: "assets/logos/nestle.jfif", newFile: "assets/logos/nestle-new.png", brand: "Nestle", aliases: ["Nestlé"], category: "food" },
  { file: "assets/logos/porsche.jpg", newFile: "assets/logos/porsche-new.jfif", brand: "Porsche", aliases: [], category: "automobile" },
  { file: "assets/logos/3m.jpg", newFile: "assets/logos/3m-new.png", brand: "3M", aliases: [], category: "fmcg" },
  { file: "assets/logos/burger-king.jpg", newFile: "assets/logos/burger-king-new.png", brand: "Burger King", aliases: ["BK"], category: "fastfood" },
  { file: "assets/logos/amazon.jpg", newFile: "assets/logos/amazon-new.webp", brand: "Amazon", aliases: [], category: "ecommerce" },
  { file: "assets/logos/tata.jpg", newFile: "assets/logos/tata-new.jfif", brand: "Tata", aliases: [], category: "automobile" },
  { file: "assets/logos/hsbc.jfif", newFile: "assets/logos/hsbc-new.jpg", brand: "HSBC", aliases: [], category: "finance" },
  { file: "assets/logos/mobil-oil.jpg", newFile: "assets/logos/mobil-oil-new.jfif", brand: "Mobil Oil", aliases: ["Mobil"], category: "energy" },
  { file: "assets/logos/bsnl.jpg", newFile: "assets/logos/bsnl-new.png", brand: "BSNL", aliases: [], category: "telecom" },
  { file: "assets/logos/adidas.jfif", newFile: "assets/logos/adidas-new.png", brand: "Adidas", aliases: [], category: "apparel" },
  { file: "assets/logos/kodak.jpg", newFile: "assets/logos/kodak-new.jpg", brand: "Kodak", aliases: [], category: "tech" },
  { file: "assets/logos/fedex.png", newFile: "assets/logos/fedex-new.png", brand: "FedEx", aliases: [], category: "logistics" },
  { file: "assets/logos/lacoste.jpg", newFile: "assets/logos/lacoste-new.png", brand: "Lacoste", aliases: [], category: "apparel" },
  { file: "assets/logos/mahindra.png", newFile: "assets/logos/mahindra-new.avif", brand: "Mahindra", aliases: [], category: "automobile" },
  { file: "assets/logos/starbucks.jfif", newFile: "assets/logos/starbucks-new.jfif", brand: "Starbucks", aliases: [], category: "fastfood" },
  { file: "assets/logos/crocs.jpg", newFile: "assets/logos/crocs-new.webp", brand: "Crocs", aliases: [], category: "apparel" },
  { file: "assets/logos/audi.png", newFile: "assets/logos/audi-new.jpg", brand: "Audi", aliases: [], category: "automobile" },
  { file: "assets/logos/bacardi.jpg", newFile: "assets/logos/bacardi-new.jpg", brand: "Bacardi", aliases: [], category: "alcohol" },
  { file: "assets/logos/procter-gamble.jpg", newFile: "assets/logos/procter-gamble-new.webp", brand: "Procter & Gamble", aliases: ["P&G", "Procter and Gamble"], category: "fmcg" },
  { file: "assets/logos/dell.jpg", newFile: "assets/logos/dell-new.png", brand: "Dell", aliases: [], category: "tech" },
  { file: "assets/logos/nasa.jfif", newFile: "assets/logos/nasa-new.webp", brand: "NASA", aliases: [], category: "space" },
  { file: "assets/logos/canon.gif", newFile: "assets/logos/canon-new.jpg", brand: "Canon", aliases: [], category: "tech" },
  { file: "assets/logos/sony.png", newFile: "assets/logos/sony-new.jfif", brand: "Sony", aliases: [], category: "tech" },
  { file: "assets/logos/levis.jpg", newFile: "assets/logos/levis-new.png", brand: "Levi's", aliases: ["Levis"], category: "apparel" },
  { file: "assets/logos/burberry.webp", newFile: "assets/logos/burberry-new.jfif", brand: "Burberry", aliases: [], category: "apparel" },
  { file: "assets/logos/nokia.png", newFile: "assets/logos/nokia-new.png", brand: "Nokia", aliases: [], category: "tech" },
  { file: "assets/logos/aston-martin.jfif", newFile: "assets/logos/aston-martin-new.jpg", brand: "Aston Martin", aliases: [], category: "automobile" },
  { file: "assets/logos/instagram.png", newFile: "assets/logos/instagram-new.jfif", brand: "Instagram", aliases: ["Insta"], category: "tech" },
  { file: "assets/logos/peugeot.png", newFile: "assets/logos/peugeot-new.jpg", brand: "Peugeot", aliases: [], category: "automobile" },
  { file: "assets/logos/windows.jpg", newFile: "assets/logos/windows-new.avif", brand: "Windows", aliases: ["Microsoft Windows"], category: "tech" },
  { file: "assets/logos/ibm.webp", newFile: "assets/logos/ibm-new.webp", brand: "IBM", aliases: [], category: "tech" },
  { file: "assets/logos/safari.jpg", newFile: "assets/logos/safari-new.png", brand: "Safari", aliases: [], category: "tech" },
  { file: "assets/logos/puma.png", newFile: "assets/logos/puma-new.png", brand: "Puma", aliases: [], category: "apparel" },
  { file: "assets/logos/ups.png", newFile: "assets/logos/ups-new.webp", brand: "UPS", aliases: [], category: "logistics" },
  { file: "assets/logos/snapchat.png", newFile: "assets/logos/snapchat-new.jpeg", brand: "Snapchat", aliases: [], category: "tech" },
  { file: "assets/logos/nissan.webp", newFile: "assets/logos/nissan-new.jpg", brand: "Nissan", aliases: [], category: "automobile" },
  { file: "assets/logos/shell.png", newFile: "assets/logos/shell-new.jpg", brand: "Shell", aliases: [], category: "energy" },
];

/* ---------- ROUND 2 — TAGLINE RECOGNITION ----------
   Player sees the tagline text and must type the brand name.
*/
const ROUND2_TAGLINES = [
  { tagline: "The Taste of India", brand: "Amul", aliases: [], category: "food" },
  { tagline: "Jaago Re", brand: "Tata Tea", aliases: ["Tata"], category: "food" },
  { tagline: "Zindagi Ke Saath Bhi, Zindagi Ke Baad Bhi", brand: "LIC", aliases: [], category: "finance" },
  { tagline: "Har Ghar Kuch Kehta Hai", brand: "Asian Paints", aliases: [], category: "fmcg" },
  { tagline: "Fevicol Ka Mazboot Jod", brand: "Fevicol", aliases: [], category: "fmcg" },
  { tagline: "Express Yourself", brand: "Airtel", aliases: [], category: "telecom" },
  { tagline: "Digital Life", brand: "Reliance Jio", aliases: ["Jio"], category: "telecom" },
  { tagline: "G Maane Genius", brand: "Parle-G", aliases: ["Parle"], category: "food" },
  { tagline: "Rise", brand: "Mahindra", aliases: [], category: "automobile" },
  { tagline: "Daag Achhe Hain", brand: "Surf Excel", aliases: ["Surf"], category: "fmcg" },
  { tagline: "Celebrate Life", brand: "Dabur", aliases: [], category: "fmcg" },
  { tagline: "Har Rang Kuch Kehta Hai", brand: "Asian Paints Royale", aliases: ["Asian Paints"], category: "fmcg" },
  { tagline: "Hamara Bajaj", brand: "Bajaj", aliases: [], category: "automobile" },
  { tagline: "Taste of Tradition", brand: "Haldiram's", aliases: ["Haldirams"], category: "food" },
  { tagline: "Washing Powder Nirma", brand: "Nirma", aliases: [], category: "fmcg" },
  { tagline: "Just Do It", brand: "Nike", aliases: [], category: "apparel" },
  { tagline: "Think Different", brand: "Apple", aliases: [], category: "tech" },
  { tagline: "I'm Lovin' It", brand: "McDonald's", aliases: ["McDonalds"], category: "fastfood" },
  { tagline: "Impossible Is Nothing", brand: "Adidas", aliases: [], category: "apparel" },
  { tagline: "Real Magic", brand: "Coca-Cola", aliases: ["Coke", "Coca Cola"], category: "beverage" },
  { tagline: "Because You're Worth It", brand: "L'Oréal", aliases: ["Loreal"], category: "personalcare" },
  { tagline: "It's Finger Lickin' Good", brand: "KFC", aliases: [], category: "fastfood" },
  { tagline: "The Ultimate Driving Machine", brand: "BMW", aliases: [], category: "automobile" },
  { tagline: "The Best or Nothing", brand: "Mercedes-Benz", aliases: ["Mercedes", "Benz"], category: "automobile" },
  { tagline: "Do What You Can't", brand: "Samsung", aliases: [], category: "tech" },
  { tagline: "Connecting People", brand: "Nokia", aliases: [], category: "tech" },
  { tagline: "Have a Break, Have a KitKat", brand: "KitKat", aliases: [], category: "food" },
  { tagline: "Eat Fresh", brand: "Subway", aliases: [], category: "fastfood" },
  { tagline: "Where Dreams Come True", brand: "Disney", aliases: [], category: "entertainment" },
  { tagline: "There Are Some Things Money Can't Buy. For Everything Else, There's Mastercard", brand: "Mastercard", aliases: [], category: "finance" },

  { tagline: "Yeh Dil Maange More!", brand: "Pepsi", aliases: [], category: "beverage" },
  { tagline: "Red Bull Gives You Wings", brand: "Red Bull", aliases: ["RedBull"], category: "beverage" },
  { tagline: "The Best a Man Can Get", brand: "Gillette", aliases: [], category: "personalcare" },
  { tagline: "It's Everywhere You Want to Be", brand: "Visa", aliases: [], category: "finance" },
  { tagline: "Don't Leave Home Without It", brand: "American Express", aliases: ["Amex"], category: "finance" },
  { tagline: "A Diamond is Forever", brand: "De Beers", aliases: ["Debeers"], category: "luxury" },
  { tagline: "Keeps Going and Going", brand: "Energizer", aliases: [], category: "battery" },
  { tagline: "Save Money. Live Better.", brand: "Walmart", aliases: [], category: "retail" },
  { tagline: "Expect More. Pay Less.", brand: "Target", aliases: [], category: "retail" },
  { tagline: "America Runs on Dunkin'", brand: "Dunkin'", aliases: ["Dunkin", "Dunkin Donuts"], category: "fastfood" },
  { tagline: "Betcha Can't Eat Just One", brand: "Lay's", aliases: ["Lays"], category: "food" },
  { tagline: "The Quicker Picker Upper", brand: "Bounty", aliases: [], category: "fmcg" },
  { tagline: "The Best Part of Wakin' Up", brand: "Folgers", aliases: [], category: "food" },
  { tagline: "Can You Hear Me Now?", brand: "Verizon", aliases: [], category: "telecom" },
  { tagline: "We Try Harder", brand: "Avis", aliases: [], category: "rental" },
  { tagline: "Let's Go Places", brand: "Toyota", aliases: [], category: "automobile" },
  { tagline: "The Power of Dreams", brand: "Honda", aliases: [], category: "automobile" },
  { tagline: "Built Ford Tough", brand: "Ford", aliases: [], category: "automobile" },
  { tagline: "Find New Roads", brand: "Chevrolet", aliases: ["Chevy"], category: "automobile" },
  { tagline: "Das Auto", brand: "Volkswagen", aliases: ["VW"], category: "automobile" },
  { tagline: "Strong Is Beautiful", brand: "Pantene", aliases: [], category: "personalcare" },
  { tagline: "You Never Get A Second Chance To Make A First Impression", brand: "Head & Shoulders", aliases: ["Head and Shoulders"], category: "personalcare" },
  { tagline: "Smell Like A Man, Man", brand: "Old Spice", aliases: [], category: "personalcare" },
  { tagline: "The Axe Effect", brand: "Axe", aliases: [], category: "personalcare" },
  { tagline: "It All Starts With a Nescafé", brand: "Nescafe", aliases: ["Nescafé"], category: "food" },
  { tagline: "Kuch Meetha Ho Jaaye", brand: "Cadbury Dairy Milk", aliases: ["Cadbury", "Dairy Milk"], category: "food" },
  { tagline: "Have It Your Way", brand: "Burger King", aliases: ["BK"], category: "fastfood" },
  { tagline: "Where's the Beef?", brand: "Wendy's", aliases: ["Wendys"], category: "fastfood" },
  { tagline: "No One Outpizzas The Hut", brand: "Pizza Hut", aliases: [], category: "fastfood" },
  { tagline: "Hungry? Grab a Snickers", brand: "Snickers", aliases: [], category: "food" },
  { tagline: "Melts In Your Mouth, Not In Your Hand", brand: "M&M's", aliases: ["M&Ms", "M and Ms"], category: "food" },
  { tagline: "Taste the Rainbow", brand: "Skittles", aliases: [], category: "food" },
  { tagline: "Is It In You?", brand: "Gatorade", aliases: [], category: "beverage" },
  { tagline: "Protect This House", brand: "Under Armour", aliases: [], category: "apparel" },
  { tagline: "I Am What I Am", brand: "Reebok", aliases: [], category: "apparel" },
  { tagline: "Forever Faster", brand: "Puma", aliases: [], category: "apparel" },
  { tagline: "Quality Never Goes Out Of Style", brand: "Levi's", aliases: ["Levis"], category: "apparel" },
  { tagline: "American By Birth. Rebel By Choice.", brand: "Harley-Davidson", aliases: ["Harley Davidson", "Harley"], category: "automobile" },
  { tagline: "Go Anywhere. Do Anything.", brand: "Jeep", aliases: [], category: "automobile" },
  { tagline: "Above and Beyond", brand: "Land Rover", aliases: ["LandRover"], category: "automobile" },
  { tagline: "Vorsprung Durch Technik", brand: "Audi", aliases: [], category: "automobile" },
  { tagline: "There Is No Substitute", brand: "Porsche", aliases: [], category: "automobile" },
  { tagline: "For Life", brand: "Volvo", aliases: [], category: "automobile" },
  { tagline: "Rebuild The World", brand: "LEGO", aliases: ["Lego"], category: "toys" },
  { tagline: "Broadcast Yourself", brand: "YouTube", aliases: ["You Tube"], category: "tech" },
  { tagline: "Music for Everyone", brand: "Spotify", aliases: [], category: "entertainment" },
  { tagline: "Live in Your World, Play in Ours", brand: "PlayStation", aliases: ["PS", "Play Station"], category: "entertainment" },
  { tagline: "Intel Inside", brand: "Intel", aliases: [], category: "tech" },
  { tagline: "Life's Good", brand: "LG", aliases: [], category: "tech" },
  { tagline: "Buy It. Sell It. Love It.", brand: "eBay", aliases: ["Ebay"], category: "ecommerce" },
];

/* ---------- ROUND 3 — TUNE / JINGLE RECOGNITION ----------
   Player hears the audio clip and must type the brand name.
   >>> FILL IN THE "brand" FOR EACH FILE BELOW <<<
   Files are in assets/audio/tune-1.mpeg ... tune-16.mpeg, in
   the same order as the original WhatsApp timestamps:
     tune-1  = 2.08.45 AM
     tune-2  = 2.08.46 AM
     tune-3  = 2.08.47 AM
     tune-4  = 2.08.48 AM (1)
     tune-5  = 2.08.48 AM
     tune-6  = 2.08.49 AM
     tune-7  = 2.08.50 AM (1)
     tune-8  = 2.08.50 AM
     tune-9  = 2.08.51 AM
     tune-10 = 2.08.52 AM
     tune-11 = 2.08.53 AM (1)
     tune-12 = 2.08.53 AM
     tune-13 = 2.08.54 AM
     tune-14 = 2.08.55 AM (1)
     tune-15 = 2.08.55 AM
     tune-16 = 2.08.56 AM
*/
const ROUND3_TUNES = [
  { file: "assets/audio/tune-1.mpeg", brand: "BlackBerry", aliases: ["Blackberry"], category: "tech" },
  { file: "assets/audio/tune-2.mpeg", brand: "Sony", aliases: [], category: "tech" },
  { file: "assets/audio/tune-3.mpeg", brand: "Honor", aliases: [], category: "tech" },
  { file: "assets/audio/tune-4.mpeg", brand: "Reliance", aliases: ["Reliance Jio", "Jio"], category: "telecom" },
  { file: "assets/audio/tune-5.mpeg", brand: "Idea", aliases: [], category: "telecom" },
  { file: "assets/audio/tune-6.mpeg", brand: "Vodafone", aliases: [], category: "telecom" },
  { file: "assets/audio/tune-7.mpeg", brand: "BSNL", aliases: [], category: "telecom" },
  { file: "assets/audio/tune-8.mpeg", brand: "Windows 8", aliases: ["Window 8"], category: "tech" },
  { file: "assets/audio/tune-9.mpeg", brand: "Windows 7", aliases: ["Window 7"], category: "tech" },
  { file: "assets/audio/tune-10.mpeg", brand: "BHIM", aliases: [], category: "finance" },
  { file: "assets/audio/tune-11.mpeg", brand: "Imperial Blue", aliases: [], category: "alcohol" },
  { file: "assets/audio/tune-12.mpeg", brand: "Taj Mahal Tea", aliases: ["Taj Mahal"], category: "food" },
  { file: "assets/audio/tune-13.mpeg", brand: "Airtel", aliases: [], category: "telecom" },
  { file: "assets/audio/tune-14.mpeg", brand: "Royal Enfield", aliases: [], category: "automobile" },
  { file: "assets/audio/tune-15.mpeg", brand: "Johnnie Walker", aliases: ["Johnny Walker"], category: "alcohol" },
  { file: "assets/audio/tune-16.mpeg", brand: "Rajasthan Tourism", aliases: [], category: "tourism" },
];

/* ---------- SHARED BRAND POOL ----------
   Used to auto-generate multiple-choice distractors for Rounds 1-3.
   Combines every brand name from Round 1, 2 and 3 so wrong options
   feel plausible without being manually written.
*/
const BRAND_POOL = Array.from(
  new Set([
    ...ROUND1_LOGOS.map((x) => x.brand),
    ...ROUND2_TAGLINES.map((x) => x.brand),
    ...ROUND3_TUNES.map((x) => x.brand),
  ])
);

/* ---------- CATEGORY-AWARE DISTRACTOR POOLS ----------
   Every logo/tagline/tune above now carries a "category" (e.g.
   "automobile", "telecom", "fastfood"). To make wrong MCQ options
   genuinely confusable instead of randomly unrelated, distractors
   are drawn from the SAME category first. These "extra" names are
   decoys only — they're never asked as a question themselves, just
   used to pad out thin categories so there's always enough same-
   category noise to pick from.
*/
const CATEGORY_DISTRACTOR_EXTRAS = {
  automobile: ["Hyundai", "Kia", "Skoda", "Renault", "Fiat", "Royal Enfield", "TVS", "Hero MotoCorp"],
  telecom: ["MTNL", "Tata Docomo", "Aircel", "T-Mobile", "AT&T"],
  tech: ["Microsoft", "HP", "Lenovo", "Xiaomi", "OnePlus", "Panasonic", "Asus", "Acer"],
  apparel: ["Zara", "H&M", "Gap", "Tommy Hilfiger", "Calvin Klein", "Fila"],
  fastfood: ["Domino's", "Taco Bell", "Chick-fil-A", "Five Guys"],
  food: ["Britannia", "Kellogg's", "Oreo", "Lindt", "Hershey's", "Nutella"],
  beverage: ["Sprite", "Fanta", "Mountain Dew", "Thums Up", "Mirinda", "7UP"],
  personalcare: ["Dove", "Nivea", "Colgate", "Lifebuoy", "Lux", "Vaseline"],
  finance: ["PayPal", "RuPay", "ICICI Bank", "HDFC Bank", "SBI", "Axis Bank"],
  fmcg: ["Lifebuoy", "Lux", "Vicks", "Colgate", "Pond's"],
  alcohol: ["Budweiser", "Jack Daniel's", "Absolut Vodka", "Jim Beam", "Kingfisher"],
  logistics: ["DHL", "Blue Dart", "USPS", "DTDC"],
  energy: ["BP", "ExxonMobil", "Chevron", "Indian Oil", "HP Gas"],
  luxury: ["Tiffany & Co.", "Cartier", "Rolex", "Gucci"],
  retail: ["Costco", "Big Bazaar", "IKEA", "D-Mart"],
  airline: ["Delta Airlines", "Emirates", "IndiGo", "Lufthansa", "Air India"],
  tourism: ["Incredible India", "Kerala Tourism", "Gujarat Tourism", "Madhya Pradesh Tourism"],
  space: ["ISRO", "SpaceX", "Roscosmos"],
  toys: ["Mattel", "Hasbro", "Barbie", "Funskool"],
  ecommerce: ["Flipkart", "Alibaba", "Etsy", "Snapdeal"],
  rental: ["Hertz", "Enterprise", "Zipcar"],
  battery: ["Duracell", "Eveready", "Panasonic"],
  entertainment: ["Netflix", "Hulu", "Amazon Prime Video", "HBO"],
};

const CATEGORY_POOLS = {};
[...ROUND1_LOGOS, ...ROUND2_TAGLINES, ...ROUND3_TUNES].forEach((item) => {
  const cat = item.category || "misc";
  if (!CATEGORY_POOLS[cat]) CATEGORY_POOLS[cat] = new Set();
  CATEGORY_POOLS[cat].add(item.brand);
});
Object.keys(CATEGORY_DISTRACTOR_EXTRAS).forEach((cat) => {
  if (!CATEGORY_POOLS[cat]) CATEGORY_POOLS[cat] = new Set();
  CATEGORY_DISTRACTOR_EXTRAS[cat].forEach((name) => CATEGORY_POOLS[cat].add(name));
});
Object.keys(CATEGORY_POOLS).forEach((cat) => {
  CATEGORY_POOLS[cat] = Array.from(CATEGORY_POOLS[cat]);
});

/* ---------- ROUND 4 — FINAL: MARKETING MCQs ----------
   10 questions are picked at random from this pool each game.
   >>> REPLACE/EXTEND WITH YOUR OWN QUESTIONS <<<
   "correct" is the 0-based index into "options".
*/
const ROUND4_MCQS = [
  {
    q: "What does the 4 Ps of marketing stand for?",
    options: ["Product, Price, Place, Promotion", "Plan, Price, People, Profit", "Product, Promotion, Profit, People", "Place, Plan, Price, Product"],
    correct: 0,
  },
  {
    q: "Which pricing strategy sets an initial high price and lowers it over time?",
    options: ["Penetration pricing", "Price skimming", "Bundle pricing", "Dynamic pricing"],
    correct: 1,
  },
  {
    q: "What is a 'USP' in marketing?",
    options: ["Universal Sales Plan", "Unit Sales Price", "Unique Selling Proposition", "User Satisfaction Percentage"],
    correct: 2,
  },
  {
    q: "What does B2B stand for?",
    options: ["Business to Business", "Brand to Brand", "Buyer to Business", "Business to Brand"],
    correct: 0,
  },
  {
    q: "Which of these is an example of 'guerrilla marketing'?",
    options: ["A TV commercial during prime time", "An unconventional, low-cost street stunt to surprise an audience", "A quarterly earnings report", "A loyalty points program"],
    correct: 1,
  },
  {
    q: "What is 'brand equity'?",
    options: ["The legal ownership of a trademark", "The value a brand adds to a product beyond its functional benefits", "The stock price of a company", "The number of employees in a company"],
    correct: 1,
  },
  {
    q: "What does 'CTR' stand for in digital marketing?",
    options: ["Customer Transaction Rate", "Click Through Rate", "Cost To Revenue", "Content Targeting Ratio"],
    correct: 1,
  },
  {
    q: "Which of these best describes 'market segmentation'?",
    options: ["Dividing a market into distinct groups of buyers with different needs", "Setting the final price of a product", "Designing a company logo", "Measuring factory output"],
    correct: 0,
  },
  {
    q: "What is a 'tagline' meant to do?",
    options: ["List a company's financial results", "Capture a brand's essence in a short, memorable phrase", "Replace the company logo", "State the company's legal address"],
    correct: 1,
  },
  {
    q: "What does 'SEO' stand for?",
    options: ["Sales Engagement Outreach", "Search Engine Optimization", "Social Engagement Opportunity", "Service Excellence Objective"],
    correct: 1,
  },
  {
    q: "What is 'word of mouth' marketing?",
    options: ["Paid television advertising", "Informal person-to-person communication about a product", "A company's annual report", "A trademark registration process"],
    correct: 1,
  },
  {
    q: "What does ROI stand for?",
    options: ["Rate of Interest", "Return on Investment", "Record of Income", "Return on Inventory"],
    correct: 1,
  },
  {
    q: "Which term describes repackaging an old product with new features to boost sales?",
    options: ["Product relaunch", "Market skimming", "Vertical integration", "Cannibalization"],
    correct: 0,
  },
  {
    q: "What is a 'target audience'?",
    options: ["Everyone who sees an advertisement", "The specific group of consumers a product/campaign is aimed at", "The company's board of directors", "A random sample of the population"],
    correct: 1,
  },
  {
    q: "In marketing, what does 'churn rate' measure?",
    options: ["The percentage of customers who stop using a product over a period", "The speed of production", "The number of new hires", "The profit margin on a product"],
    correct: 0,
  },
  {
    q: "What is 'rebranding'?",
    options: ["Filing a new trademark application", "Changing a company's name, logo, or image to create a new identity", "Hiring a new marketing manager", "Lowering product prices permanently"],
    correct: 1,
  },
  {
    q: "What does 'CRM' stand for?",
    options: ["Customer Relationship Management", "Content Revenue Model", "Corporate Risk Management", "Consumer Rating Metric"],
    correct: 0,
  },
  {
    q: "What is a 'call to action' (CTA) in an advertisement?",
    options: ["A legal disclaimer", "A prompt urging the audience to take a specific action", "The brand's slogan", "The background music in an ad"],
    correct: 1,
  },
  {
    q: "What does 'viral marketing' rely on most?",
    options: ["Paid television slots", "Content being shared rapidly from person to person", "Government regulation", "In-store displays only"],
    correct: 1,
  },
  {
    q: "Which term refers to a company's loyal customers actively promoting its brand?",
    options: ["Brand advocacy", "Market saturation", "Price elasticity", "Inventory turnover"],
    correct: 0,
  },
  {
    q: "What is 'influencer marketing'?",
    options: ["Marketing led by a company's board of directors", "Promoting products through people with an engaged audience/following", "A government ad policy", "Marketing aimed only at competitors"],
    correct: 1,
  },
  {
    q: "What does 'KPI' stand for?",
    options: ["Key Performance Indicator", "Known Product Issue", "Keyword Positioning Index", "Key Profit Increase"],
    correct: 0,
  },
  {
    q: "What is a 'freemium' business model?",
    options: ["All features are free forever", "Basic features are free, advanced features require payment", "Only premium customers can sign up", "Products are sold exclusively at a discount"],
    correct: 1,
  },
  {
    q: "What does 'positioning' mean in marketing?",
    options: ["Placing products on a store shelf", "How a brand is perceived in customers' minds relative to competitors", "The GPS location of a company's office", "Arranging staff seating in an office"],
    correct: 1,
  },
  {
    q: "What is 'cross-selling'?",
    options: ["Selling the same product in two countries", "Offering a customer a related or complementary product", "Selling products below cost", "Selling only through resellers"],
    correct: 1,
  },
  {
    q: "What does 'A/B testing' in marketing involve?",
    options: ["Comparing two versions of a campaign to see which performs better", "Testing a product in two different factories", "Auditing a company's finances", "Training two sales teams separately"],
    correct: 0,
  },
  {
    q: "What is a 'loyalty program' designed to do?",
    options: ["Reduce product quality", "Reward repeat customers to encourage continued purchases", "Replace customer service", "Increase shipping costs"],
    correct: 1,
  },
  {
    q: "What does 'impulse buying' refer to?",
    options: ["A planned, budgeted purchase", "An unplanned purchase decision made on the spot", "A bulk wholesale order", "A subscription renewal"],
    correct: 1,
  },
  {
    q: "What is 'niche marketing'?",
    options: ["Marketing to the entire mass market", "Targeting a small, specific segment of the market", "Marketing only through billboards", "Selling a product in every country at once"],
    correct: 1,
  },
  {
    q: "What does 'organic reach' mean on social media?",
    options: ["Reach gained only through paid ads", "The number of people who see a post without paid promotion", "The number of followers a brand pays for", "The total ad budget spent"],
    correct: 1,
  },
  {
    q: "What is a 'value proposition'?",
    options: ["A legal contract between buyer and seller", "A clear statement of the benefit a product offers to customers", "A company's tax filing", "A discount coupon code"],
    correct: 1,
  },
  {
    q: "What does 'customer lifetime value' (CLV) estimate?",
    options: ["The number of years a product lasts", "The total revenue a business can expect from one customer over time", "The warranty period of a product", "The average age of customers"],
    correct: 1,
  },
  {
    q: "What is 'product bundling'?",
    options: ["Selling products individually at full price", "Selling several products together as one combined offer", "Removing products from the market", "Packaging a product in recyclable material"],
    correct: 1,
  },
  {
    q: "What does 'brand recall' measure?",
    options: ["How quickly a product is manufactured", "The ability of consumers to remember a brand without being prompted", "The number of returns a product gets", "A company's stock performance"],
    correct: 1,
  },
  {
    q: "What is 'ambush marketing'?",
    options: ["Officially sponsoring an event", "Associating a brand with an event without paying for sponsorship rights", "A type of door-to-door sales", "Marketing aimed at competitors' employees"],
    correct: 1,
  },
  {
    q: "What does 'omnichannel marketing' mean?",
    options: ["Marketing through a single channel only", "Providing a seamless, integrated customer experience across multiple channels", "Marketing exclusively on TV", "Avoiding digital channels"],
    correct: 1,
  },
  {
    q: "What is a 'focus group' used for in marketing?",
    options: ["Training the sales team", "Gathering qualitative feedback from a small group of target consumers", "Auditing financial statements", "Hiring new employees"],
    correct: 1,
  },
  {
    q: "What does 'market penetration' strategy aim to do?",
    options: ["Exit a market entirely", "Increase market share of existing products in existing markets", "Launch a brand-new product category", "Reduce advertising spend"],
    correct: 1,
  },
  {
    q: "What is 'native advertising'?",
    options: ["Ads that match the look and feel of the platform they appear on", "Advertising only in a brand's home country", "A banned form of advertising", "Advertising with no visuals"],
    correct: 0,
  },
  {
    q: "What does 'STP' stand for in marketing strategy?",
    options: ["Sales, Tax, Profit", "Segmentation, Targeting, Positioning", "Strategy, Timing, Promotion", "Supply, Trade, Pricing"],
    correct: 1,
  },
  {
    q: "What is a 'SWOT analysis' used for?",
    options: ["Calculating tax liability", "Assessing Strengths, Weaknesses, Opportunities, and Threats", "Scheduling social media posts", "Measuring warehouse inventory"],
    correct: 1,
  },
  {
    q: "What does 'B2C' stand for?",
    options: ["Business to Consumer", "Brand to Customer", "Bulk to Clearance", "Business to Code"],
    correct: 0,
  },
  {
    q: "What is 'dynamic pricing'?",
    options: ["A fixed price that never changes", "Adjusting prices in real time based on demand, competition, or other factors", "Pricing set only by government regulation", "A pricing error that needs correction"],
    correct: 1,
  },
  {
    q: "What is the main goal of 'content marketing'?",
    options: ["Selling directly through cold calls", "Attracting and retaining an audience by creating valuable content", "Filing patents for new products", "Reducing a company's tax burden"],
    correct: 1,
  },
  {
    q: "What does 'PPC' stand for in digital advertising?",
    options: ["Pay Per Click", "Product Pricing Chart", "Public Promotion Code", "Payment Processing Center"],
    correct: 0,
  },
  {
    q: "What is a 'buyer persona'?",
    options: ["A legal document for purchases", "A semi-fictional representation of a brand's ideal customer", "A type of sales receipt", "A government consumer protection law"],
    correct: 1,
  },
  {
    q: "What does 'UGC' stand for in marketing?",
    options: ["User Generated Content", "Universal Growth Code", "Unified Global Campaign", "Unique Gross Cost"],
    correct: 0,
  },
  {
    q: "What is 'co-branding'?",
    options: ["Renaming a company", "A partnership where two brands combine to market a product together", "A company rebranding itself twice in one year", "Removing a brand name from packaging"],
    correct: 1,
  },
  {
    q: "What does 'evergreen content' mean?",
    options: ["Content related only to environmental topics", "Content that stays relevant and valuable over a long period of time", "Content that is deleted after 24 hours", "Content that can only be viewed once"],
    correct: 1,
  },
  {
    q: "What is the purpose of a 'landing page'?",
    options: ["To display a company's annual report", "A standalone web page designed to convert visitors through a specific call to action", "To list employee job openings", "To host a company's blog archive"],
    correct: 1,
  },
  {
    q: "What does 'CAC' stand for in marketing?",
    options: ["Customer Acquisition Cost", "Corporate Advertising Code", "Consumer Approval Certificate", "Channel Activity Count"],
    correct: 0,
  },
  {
    q: "What is 'affiliate marketing'?",
    options: ["Marketing done only by a company's own employees", "Promoting another company's products and earning a commission on sales", "A type of government subsidy", "Marketing restricted to affiliated banks"],
    correct: 1,
  },
  {
    q: "What does 'brand loyalty' describe?",
    options: ["A legal requirement to use one brand only", "A consumer's consistent preference for and repeat purchase of a particular brand", "A brand's debt to its suppliers", "The cost of registering a trademark"],
    correct: 1,
  },
  {
    q: "What is a 'drip campaign' in email marketing?",
    options: ["A single mass email sent once", "A series of automated emails sent based on a schedule or user actions", "An email containing only images", "A campaign that targets competitors' customers"],
    correct: 1,
  },
  {
    q: "What does 'top-of-funnel' refer to in marketing?",
    options: ["The final purchase stage", "The awareness stage where potential customers first learn about a brand", "A warehouse storage term", "The stage after a refund is issued"],
    correct: 1,
  },
  {
    q: "What is 'social proof' in marketing?",
    options: ["A legal certificate for social media use", "Using reviews, testimonials, or popularity to build trust and influence buyers", "Proof of a company's tax filings", "A government-issued marketing license"],
    correct: 1,
  },
  {
    q: "What does 'churn' typically lead marketers to focus on?",
    options: ["Customer retention strategies", "Raising prices across the board", "Reducing product quality", "Closing the business"],
    correct: 0,
  },
  {
    q: "What is a 'USP' meant to differentiate?",
    options: ["A company's tax bracket", "A product or brand from its competitors", "Two departments within the same company", "A product's shipping method"],
    correct: 1,
  },
  {
    q: "What does 'programmatic advertising' use to buy ad space?",
    options: ["Manual negotiation only", "Automated, algorithm-driven bidding and buying", "Physical billboards exclusively", "Door-to-door sales agents"],
    correct: 1,
  },
  {
    q: "What is 'experiential marketing'?",
    options: ["Marketing based purely on past sales data", "Creating immersive, real-life brand experiences for consumers", "A marketing degree program", "Marketing that avoids all customer interaction"],
    correct: 1,
  },
  {
    q: "What does 'DTC' stand for in business?",
    options: ["Direct to Consumer", "Daily Trade Cycle", "Distribution Tax Credit", "Digital Transfer Contract"],
    correct: 0,
  },
  {
    q: "What is the primary purpose of a 'press release'?",
    options: ["To apply for a business loan", "To officially announce news or information to the media and public", "To record internal HR complaints", "To file a company's yearly tax return"],
    correct: 1,
  },
  {
    q: "What does 'geo-targeting' allow marketers to do?",
    options: ["Target ads based on a user's geographic location", "Target ads based only on age", "Remove all location data from ads", "Target only international customers"],
    correct: 0,
  },
  {
    q: "What is a 'competitive advantage'?",
    options: ["A legal penalty for unfair competition", "A unique attribute that allows a company to outperform its competitors", "A government subsidy for new businesses", "A type of product recall"],
    correct: 1,
  },
  {
    q: "What does 'funnel conversion rate' measure?",
    options: ["The percentage of prospects who complete a desired action", "The speed of a factory's production line", "The number of emails sent per day", "The total number of employees in sales"],
    correct: 0,
  },
  {
    q: "What is 'word-of-mouth marketing' often amplified by today?",
    options: ["Print newspapers only", "Social media and online reviews", "Radio jingles exclusively", "Billboard advertising"],
    correct: 1,
  },
  {
    q: "What does 'market research' primarily help businesses do?",
    options: ["Avoid paying taxes", "Understand customer needs, preferences, and market trends", "Automatically increase profits", "Replace the need for advertising"],
    correct: 1,
  },
  {
    q: "What is a 'flagship product'?",
    options: ["A product that has been discontinued", "A company's leading, most representative product", "A product sold only overseas", "A defective product recalled from shelves"],
    correct: 1,
  },
  {
    q: "What does 'remarketing' (or retargeting) aim to do?",
    options: ["Reach users who previously visited a website or app to encourage them to return", "Launch a brand-new marketing campaign from scratch", "Market only to first-time visitors", "Remove a product from the market permanently"],
    correct: 0,
  },
  {
    q: "What is the 'halo effect' in branding?",
    options: ["A negative reaction to a brand's logo", "Positive feelings about one product extending to other products from the same brand", "A discount offered during holidays", "A brand's annual revenue report"],
    correct: 1,
  },
  {
    q: "What does 'market share' represent?",
    options: ["A company's total annual expenses", "The percentage of total sales in an industry captured by one company", "The number of shareholders a company has", "The physical size of a company's offices"],
    correct: 1,
  },
  {
    q: "What is 'guerrilla PR'?",
    options: ["A formal government press briefing", "Unconventional, attention-grabbing publicity tactics on a low budget", "A type of legal lawsuit against competitors", "PR conducted only by government agencies"],
    correct: 1,
  },
  {
    q: "What does 'customer journey mapping' visualize?",
    options: ["A company's supply chain routes", "The steps a customer takes from awareness to purchase and beyond", "A map of store locations worldwide", "The route delivery trucks take"],
    correct: 1,
  },
  {
    q: "What is a 'soft launch' of a product?",
    options: ["A global, high-budget release campaign", "A limited release to a smaller audience before a wider rollout", "Cancelling a product before release", "A launch event held outdoors"],
    correct: 1,
  },
  {
    q: "What does 'brand voice' refer to?",
    options: ["The literal sound of a company's phone hotline", "The consistent personality and tone a brand uses in its communication", "A brand's official spokesperson's real voice recording", "The volume of a radio advertisement"],
    correct: 1,
  },
  {
    q: "What is 'upselling'?",
    options: ["Encouraging a customer to buy a cheaper alternative", "Encouraging a customer to purchase a more expensive or upgraded version of a product", "Returning a sold product for a refund", "Selling a product below its cost price"],
    correct: 1,
  },
  {
    q: "What does 'impression' mean in digital advertising?",
    options: ["A customer's written review of a product", "A single instance of an ad being displayed to a user", "A confirmed sale", "A refund request"],
    correct: 1,
  },
  {
    q: "What is a 'white paper' used for in B2B marketing?",
    options: ["A legal contract template", "An in-depth report that educates readers about a complex issue or solution", "A blank product label", "An internal HR policy document"],
    correct: 1,
  },
  {
    q: "What does 'market skimming' pricing strategy involve?",
    options: ["Setting a low price to gain quick market share", "Setting a high price initially and gradually lowering it", "Giving products away for free", "Pricing all products identically"],
    correct: 1,
  },
  {
    q: "What is a 'conversion funnel'?",
    options: ["A physical device used in factories", "The stages a potential customer moves through before making a purchase", "A legal term for bankruptcy", "A tool for filtering spam emails only"],
    correct: 1,
  },
  {
    q: "What does 'engagement rate' typically measure on social media?",
    options: ["The number of employees at a company", "Interactions (likes, comments, shares) relative to reach or followers", "A company's net profit margin", "The number of ads a company runs per year"],
    correct: 1,
  },
  {
    q: "What is 'ambient advertising'?",
    options: ["Advertising placed in unexpected, everyday environments to surprise consumers", "Advertising only played in elevators", "A ban on outdoor advertising", "Advertising exclusively through weather apps"],
    correct: 0,
  },
  {
    q: "What does 'churned revenue' refer to?",
    options: ["Revenue gained from new customers only", "Revenue lost due to customers cancelling or not renewing", "Total company revenue before tax", "Revenue from a single flagship product"],
    correct: 1,
  },
  {
    q: "What is the purpose of 'A/B testing' a landing page?",
    options: ["To compare two page versions and see which converts better", "To test a page's loading speed only", "To check for spelling errors", "To duplicate a page across multiple domains"],
    correct: 0,
  },
  {
    q: "What does 'brand awareness' measure?",
    options: ["How much a company spends on raw materials", "How familiar consumers are with a brand's existence and identity", "A brand's stock market valuation", "The number of patents a company holds"],
    correct: 1,
  },
  {
    q: "What is a 'teaser campaign'?",
    options: ["A full product reveal with all details", "A marketing campaign that reveals limited information to build anticipation", "A campaign aimed only at children", "A campaign that mocks competitors directly"],
    correct: 1,
  },
  {
    q: "What does 'customer churn rate' help a business identify?",
    options: ["How many customers are leaving over a given period", "How many new products are launched per year", "The average employee turnover rate", "The number of physical store locations"],
    correct: 0,
  },
  {
    q: "What is 'in-app advertising'?",
    options: ["Ads shown exclusively on television", "Advertisements displayed within mobile applications", "Advertisements printed on physical product packaging", "Advertising banned from all apps"],
    correct: 1,
  },
  {
    q: "What does 'product differentiation' help a company achieve?",
    options: ["Making a product identical to competitors", "Standing out from competitors through unique features or benefits", "Lowering production costs only", "Avoiding all forms of advertising"],
    correct: 1,
  },
  {
    q: "What is the role of a 'brand ambassador'?",
    options: ["To file legal trademarks on behalf of a company", "To represent and promote a brand's image and values publicly", "To manage a company's internal payroll", "To audit a company's financial statements"],
    correct: 1,
  },
  {
    q: "What does 'lead nurturing' involve?",
    options: ["Immediately deleting unqualified leads", "Building relationships with potential customers at every stage of the sales funnel", "Selling leads to competitors", "Ignoring leads until they contact the company first"],
    correct: 1,
  },
  {
    q: "What is a 'market gap'?",
    options: ["A legal loophole in advertising law", "An unmet customer need not currently served by existing products", "The physical space between two competing stores", "A temporary closure of a marketplace"],
    correct: 1,
  },
  {
    q: "What does 'ROAS' stand for in advertising?",
    options: ["Rate of Annual Sales", "Return on Ad Spend", "Retail Operations Audit System", "Revenue Over Average Sales"],
    correct: 1,
  },
  {
    q: "What is 'brand positioning'?",
    options: ["The physical placement of products on a shelf", "The strategic process of establishing a brand's unique place in customers' minds", "A legal filing for brand registration", "The GPS location of a brand's headquarters"],
    correct: 1,
  },
  {
    q: "What does 'influencer tier' such as 'micro-influencer' typically refer to?",
    options: ["An influencer's age group", "An influencer's follower count and reach size", "An influencer's physical height", "A government-assigned influencer rank"],
    correct: 1,
  },
  {
    q: "What is 'shelf life' in product marketing?",
    options: ["How long a product remains sellable or usable before quality declines", "The number of years a company has existed", "The height of a product on a store shelf", "A product's warranty period only"],
    correct: 0,
  },
  {
    q: "What does 'market segmentation by demographics' use?",
    options: ["Weather patterns", "Factors like age, gender, income, and education", "Stock market trends", "A company's internal org chart"],
    correct: 1,
  },
  {
    q: "What is the goal of 'retention marketing'?",
    options: ["Attracting entirely new customers only", "Keeping existing customers engaged and loyal over time", "Reducing a company's product range", "Lowering employee retention rates"],
    correct: 1,
  },
  {
    q: "What does 'earned media' refer to in PR?",
    options: ["Paid advertisements on TV", "Publicity gained through organic means like press coverage or word of mouth", "A company's owned social media accounts", "Media bought through an ad agency"],
    correct: 1,
  },
  {
    q: "What is 'personalization' in marketing?",
    options: ["Sending identical messages to every customer", "Tailoring content, offers, or experiences to individual customer preferences", "Removing all customer data from marketing systems", "A legal requirement for product labeling"],
    correct: 1,
  },
  {
    q: "What does 'sunk cost' refer to in a marketing budget decision?",
    options: ["Money already spent that cannot be recovered", "Future projected advertising expenses", "A refund issued to customers", "The cost of sinking a competitor's campaign"],
    correct: 0,
  },
];
