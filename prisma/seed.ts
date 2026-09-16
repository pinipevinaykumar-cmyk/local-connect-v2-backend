import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// District → Mandal → Villages (comprehensive AP data)
const AP_DATA: Record<string, Record<string, string[]>> = {

  'Alluri Sitharama Raju': {
    'Paderu':           ['Paderu Town','Araku Valley','Dumbriguda','G.Madugula'],
    'Rampachodavaram':  ['Rampachodavaram','Addateegala','Devipatnam','Y Ramavaram'],
    'Chintapalle':      ['Chintapalle','Koyyuru','G.K.Veedhi','Munchingiputtu'],
    'Araku Valley':     ['Araku Valley','Ananthagiri','Hukumpeta','Dumbriguda'],
  },

  'Anakapalli': {
    'Anakapalli':       ['Anakapalli Town','Atchutapuram','Pedagantyada','Cheedikada'],
    'Bheemunipatnam':   ['Bheemunipatnam','Madhurawada','Kommadi','Rushikonda'],
    'Kasimkota':        ['Kasimkota','Rambilli','Kotauratla','Nathavaram'],
    'Nakkapalli':       ['Nakkapalli','Thagarapuvalasa','Kothavalasa','Devarapalle'],
    'Yellamanchili':    ['Yellamanchili','Golugonda','Payakaraopeta','Elamanchili'],
    'Chodavaram':       ['Chodavaram','Sriramnagar','Dowleswaram','Ranasthalam'],
    'Narsipatnam':      ['Narsipatnam','Chintapalle','Koyyuru','Tyda'],
    'Rolugunta':        ['Rolugunta','Sabbavaram','Padmanabham','Anandapuram'],
    'Paravada':         ['Paravada','Gambheeram','Anandapuram','Gajuwaka Junction'],
    'K Kotapadu':       ['K Kotapadu','Munchingiputtu','Ravikamatham','Ananthagiri'],
    'Kotauratla':       ['Kotauratla','Makavarapalem','Nathavaram','Ravikamatham'],
    'Rambilli':         ['Rambilli','Nathavaram','Cheepurupalli','Gogulampadu'],
  },

  'Anantapur': {
    'Anantapur':        ['Anantapur Town','Srinivasa Nagar','Subash Nagar','Old Town'],
    'Guntakal':         ['Guntakal Town','Gorantla','Settur','Amarapuram'],
    'Hindupur':         ['Hindupur Town','Lepakshi','Parigi','Somandepalle'],
    'Kadiri':           ['Kadiri Town','Talupula','Obuladevaracheruvu','Brahmasamudram'],
    'Dharmavaram':      ['Dharmavaram Town','Kanaganapalle','Mudigubba','Ramagiri'],
    'Tadipatri':        ['Tadipatri Town','Kondapuram','Tanakal','Kanekal'],
    'Kalyandurg':       ['Kalyandurg Town','Amadagur','Kambadur','Bommanahal'],
    'Penukonda':        ['Penukonda Town','Rolla','Somandepalle','Veldurthi'],
    'Rayadurg':         ['Rayadurg Town','Uravakonda','Yadiki','Nallamada'],
    'Narpala':          ['Narpala','Kudair','Bathalapalle','Chilamathur'],
    'Pamidi':           ['Pamidi','Beluguppa','Raptadu','Peddavaduguru'],
    'Gorantla':         ['Gorantla','Bukkarayasamudram','Chilamathur','Peddavaduguru'],
    'Singanamala':      ['Singanamala','Kanekal','Settur','Gorantla Road'],
    'Yadiki':           ['Yadiki','Rayadurg Road','Narpala','Bathalapalle'],
  },

  'Annamayya': {
    'Rajampet':         ['Rajampet Town','Dwaraka Tirumala Nagar','Rajupalem','Obulavaripalle'],
    'Rayachoti':        ['Rayachoti Town','Galiveedu','Simhadripuram','Vempalle'],
    'Kalikiri':         ['Kalikiri','Thamballapalle','Pileru','Santhipuram'],
    'Vontimitta':       ['Vontimitta','Pulicherla','Kondapuram','Rajampet Road'],
    'B Kothakota':      ['B Kothakota','Muddanuru','Vedurukuppam','Obulavaripalle'],
    'Pileru':           ['Pileru','Vedurukuppam','Santhipuram','Chinnamandem'],
    'Galiveedu':        ['Galiveedu','Odugallu','Thamballapalle','Simhadripuram'],
    'Madanapalle':      ['Madanapalle Town','Nimmanapalle','Pakala Road','Renigunta Road'],
    'Thamballapalle':   ['Thamballapalle','Penumuru','Vayalpadu','Santhipuram'],
    'Punganur':         ['Punganur','Veldurthi','Sodam','Ramasamudram'],
    'Obulavaripalle':   ['Obulavaripalle','Rajampet Road','Galiveedu Road','B Kothakota'],
    'Vayalpadu':        ['Vayalpadu','Thamballapalle Road','Punganur Road','Pileru Road'],
  },

  'Bapatla': {
    'Bapatla':          ['Bapatla Town','Inkollu Road','Chirala Road','Repalle Road'],
    'Chirala':          ['Chirala Town','Vetapalem','Korisapadu','Pamuru'],
    'Repalle':          ['Repalle Town','Nagaram','Pittalavanipalem','Pedaparupudi'],
    'Parchuru':         ['Parchuru','Karamchedu','Addanki','Ballikurava'],
    'Inkollu':          ['Inkollu','Santamagaluru','Martur','Vemuru'],
    'Vetapalem':        ['Vetapalem','Korisapadu','Tsunduru','Karlapalem'],
    'Karlapalem':       ['Karlapalem','Vemuru','Nagaram','Kolluru'],
    'Addanki':          ['Addanki','Parchuru','Santamagaluru','Ballikurava'],
    'Vemuru':           ['Vemuru','Pedakakani','Pedanandipadu','Kollipara'],
    'Nagaram':          ['Nagaram','Repalle Road','Bapatla Road','Karlapalem Road'],
    'Karamchedu':       ['Karamchedu','Parchuru Road','Addanki Road','Chirala Road'],
    'Martur':           ['Martur','Inkollu Road','Santamagaluru','Vetapalem Road'],
  },

  'Chittoor': {
    'Chittoor':         ['Chittoor Town','Puthalapattu','Yerravaripalem','Gangadhara Nellore'],
    'Tirupati Urban':   ['Tirupati Town','Renigunta','Tiruchanur','Alipiri'],
    'Srikalahasti':     ['Srikalahasti Town','Nagalapuram','Satyavedu','Venkatagiri'],
    'Puttur':           ['Puttur Town','Nagari','Pakala','Somala'],
    'Kuppam':           ['Kuppam Town','Gudupalle','Ramakuppam','Venkataramapuram'],
    'Palamaner':        ['Palamaner Town','Rompicherla','Obulampalle','Gangadhara Nellore'],
    'Nagari':           ['Nagari Town','Settipalle','Bangarupalem','Podalakur'],
    'Chandragiri':      ['Chandragiri Town','Renigunta Road','Pakala Road','Varadaiahpalem'],
    'Satyavedu':        ['Satyavedu','Tada','Naidupet','Sullurpeta'],
    'Puthalapattu':     ['Puthalapattu','Kambhamvaripalle','Yerravaripalem','Irala'],
    'Bangarupalem':     ['Bangarupalem','Settipalle','Gudipala','Kalikiri Road'],
    'Pakala':           ['Pakala','Puttur Road','Tirupati Road','Chittoor Road'],
    'Penumuru':         ['Penumuru','Vayalpadu','Thamballapalle Road','Palamaner Road'],
    'Gudupalle':        ['Gudupalle','Kuppam Road','Ramakuppam','Venkataramapuram'],
  },

  'East Godavari': {
    'Rajahmundry Urban':   ['Rajahmundry One Town','Rajahmundry Two Town','Innispeta','Ramaraopet','Morampudi','Railpet','Danavayipeta','Jagannadhapuram','Kotipalli'],
    'Rajahmundry Rural':   ['Morampudi','Pragadavaram','Nallajarla','Karakatta','Somavarappadu','Pattipadu','Kovvur Road','Bommuru Road'],
    'Bommuru':             ['Bommuru','Lalacheruvu','Pragadavaram','Korukonda Road','Gowripatnam','Kommaragiri','Velerupadu','Chintalapudi'],
    'Kadiam':              ['Kadiam','Rajolu','Rajanagaram','Kovvur Road','Gollagudem','Allavaram','Payakaraopeta','Somavaram'],
    'Biccavolu':           ['Arikarevula','Balabhadrapuram','Biccavolu','Illapalle','Kapavaram','Komaripalem','Konkuduru','Melluru','Pandalapaka','Rallakhandrika','Rangapuram','Thummalapalle','Tossipudi','Voolapalle'],
    'Anaparthi':           ['Anaparthi','Gangavaram','Gollagudem','Kothapet','Pedapalem','Maddulapalem','Siripuram','Ramaravupeta','Kothapalem','Ganugapeta','Vanapalli','Krishnarayapuram'],
    'Korukonda':           ['Korukonda','Nallajarla','Vasalatippa','Bommuru Road','Venkatrayapuram','Yerravaripalem','Kotipalli','Subbammagunta','Timmapuram'],
    'Mandapeta':           ['Mandapeta Town','Alamuru','Katuru','Draksharamam Road','Kotipalli','Devipuram','Sakhinetipalle','Ambavaram','Lingapalem'],
    'P Gannavaram':        ['P Gannavaram','Draksharamam','Mummidevaram','Razole Road','Palakoderu','Penumanchili','Konakanamitla','Veeravasaram','Nidamanuru'],
    'Ravulapalem':         ['Ravulapalem','Katrenikona','Nidadavole Junction','Pattisam','Sakhinetipalle','Denduluru','Kovvur Road','Mogalthur','Attili'],
    'Rowthulapudi':        ['Rowthulapudi','Pathapadu','Kotananduru','Thimmapuram','Bommuru Road','Nallajarla','Gowripatnam','Vasalatippa','Chintalapudi'],
    'Gangavaram':          ['Gangavaram','Sarpavaram','Munganda','Yendagandi','Thondangi','Gandepalle','Anaparthi Road','Bhimavaram Road'],
    'Thondangi':           ['Thondangi','Gandepalle','Munganda','Anaparthi Road','Yelamanchili','Tuni Road','Gokavaram','Payakaraopeta'],
    'Devipatnam':          ['Devipatnam','Vararamachandrapuram','Kunavaram','Bodapadu','Pottangi','Koyuru','Malkangiri Road','Chintur Road'],
    'Rampa Chodavaram':    ['Rampa Chodavaram','Chintur','Kunta','Y Ramavaram','Gundala','Gopalapuram','Chintoor','Kunavaram'],
    'Addateegala':         ['Addateegala','V R Puram','Kunavaram','Bodapadu','Rampa Chodavaram Road','Devipatnam Road','Gundala','Malkangiri Road'],
    'Maredumilli':         ['Maredumilli','Addateegala Road','Devipatnam Road','Gundala','Rampachodavaram Road','Chintur Road','Satyavolu'],
    'Y Ramavaram':         ['Y Ramavaram','Rampa Chodavaram Road','Chintur Road','Kunta','Gundala','Gopalapuram','Bodapadu'],
  },

  'Eluru': {
    'Eluru':              ['Eluru Town','Denduluru','Kalidindi','Nidamanuru'],
    'Narsapur':           ['Narsapur Town','Palakol','Narasapur Rural','Palakollu'],
    'Tadepalligudem':     ['Tadepalligudem Town','Kovvur','Akividu','Unguturu'],
    'Jangareddygudem':    ['Jangareddygudem','Polavaram','Velerupadu','Buttayagudem'],
    'Bhimavaram':         ['Bhimavaram Town','Undi','Kalla','Attili'],
    'Chintalapudi':       ['Chintalapudi','Pedavegi','Reddigudem','Ganapavaram'],
    'Nallajarla':         ['Nallajarla','Nidadavole','Kovvur Junction','Eluru Road'],
    'Pedavegi':           ['Pedavegi','Sidemvari Gudem','Yelamanchili','Chagallu'],
    'Denduluru':          ['Denduluru','Kalidindi','Nidadavole Road','Kaikaluru'],
    'Kovvur':             ['Kovvur','Nidadavole','Nallajarla','Tadepalligudem Road'],
    'Nidadavole':         ['Nidadavole','Nallajarla','Kovvur Road','Bhimavaram Road'],
    'Unguturu':           ['Unguturu','Gambhiraopet','Penamaluru','Challapalli'],
    'Buttayagudem':       ['Buttayagudem','Jangareddygudem Road','Velerupadu','Polavaram Road'],
    'Velerupadu':         ['Velerupadu','Jangareddygudem Road','Buttayagudem','Polavaram'],
  },

  'Guntur': {
    'Guntur':             ['Guntur Town','Brodipet','Arundelpet','Nallapadu'],
    'Tenali':             ['Tenali Town','Kollipara','Vatticherukuru','Duggirala'],
    'Mangalagiri':        ['Mangalagiri Town','Tadepalle','Undavalli','Phirangipuram'],
    'Sattenapalle':       ['Sattenapalle Town','Chilakaluripet','Edlapadu','Piduguralla'],
    'Prathipadu':         ['Prathipadu','Phirangipuram','Rentachintala','Bollapalle'],
    'Chilakaluripet':     ['Chilakaluripet','Pedakurapadu','Amaravati Road','Bollapalle'],
    'Tadepalle':          ['Tadepalle','Namburu','Phirangipuram','Pedakakani'],
    'Amaravati':          ['Amaravati','Undavalli','Thulluru','Mandadam'],
    'Ponnur':             ['Ponnur','Duggirala','Vemuru','Pedakakani'],
    'Repalle':            ['Repalle','Tsunduru','Karlapalem','Perecherla'],
    'Bapatla':            ['Bapatla','Chirala Road','Repalle','Inkollu'],
    'Narasaraopet':       ['Narasaraopet','Piduguralla','Gurazala','Macherla Road'],
    'Pedakakani':         ['Pedakakani','Kollipara','Phirangipuram','Tenali Road'],
    'Vatticherukuru':     ['Vatticherukuru','Tenali Road','Sattenapalle Road','Kollipara'],
  },

  'Kakinada': {
    'Kakinada':           ['Kakinada Town','Old Town','Nuvvalaarevu','Suryaraopeta'],
    'Pithapuram':         ['Pithapuram Town','Karapa','Gollaprolu','Ramachandrapuram Road'],
    'Samalkot':           ['Samalkot','Peddapuram','Kirlampudi','Rajanagaram'],
    'Tuni':               ['Tuni Town','Yeleswaram','Prathipadu','Chintalavalasa'],
    'Peddapuram':         ['Peddapuram','Kirlampudi','Samalkot Road','Anaparthi Road'],
    'Gollaprolu':         ['Gollaprolu','Jagannaickpur','Pedapudi','Thallarevu'],
    'Yeleswaram':         ['Yeleswaram','Kotananduru','Prathipadu','Jagannaickpur'],
    'Jagannaickpur':      ['Jagannaickpur','Pedapudi','Thallarevu','Nuvvalaarevu'],
    'Kakinada Rural':     ['Kakinada Rural','Nuvvalaarevu','Kotipalle','Sarpavaram'],
    'Kotananduru':        ['Kotananduru','Rowthulapudi','Thimmapuram','Yeleswaram Road'],
    'Prathipadu':         ['Prathipadu','Tuni Road','Pithapuram Road','Yeleswaram'],
    'Kirlampudi':         ['Kirlampudi','Samalkot Road','Peddapuram Road','Rajanagaram Road'],
  },

  'Konaseema': {
    'Amalapuram':         ['Amalapuram Town','Ambajipeta','Kothapeta','Alamuru'],
    'Razole':             ['Razole Town','Mummidivaram','Uppalaguptam','I Polavaram'],
    'Mandapeta':          ['Mandapeta','Ravulapalem','Alamuru','Razole Road'],
    'Allavaram':          ['Allavaram','Malikipuram','Mamidikuduru','Ambajipeta Road'],
    'Draksharamam':       ['Draksharamam','Sakhinetipalle','Katrenikona','Ravulapalem'],
    'Ambajipeta':         ['Ambajipeta','Alamuru','Kothapeta','Razole Road'],
    'Mummidivaram':       ['Mummidivaram','Uppalaguptam','I Polavaram','Amalapuram Road'],
    'Uppalaguptam':       ['Uppalaguptam','Narsapur','Sakhinetipalle','Katrenikona'],
    'Malikipuram':        ['Malikipuram','Mamidikuduru','Ravulapalem','Allavaram Road'],
    'I Polavaram':        ['I Polavaram','Razole','Mummidivaram','Ravulapalem Junction'],
    'Kothapeta':          ['Kothapeta','Amalapuram Road','Ambajipeta Road','Razole Road'],
    'Ravulapalem':        ['Ravulapalem','Mandapeta Road','Nidadavole Road','Pattisam'],
  },

  'Krishna': {
    'Gudivada':           ['Gudivada Town','Bethavolu','Kankipadu','Reddigudem'],
    'Machilipatnam':      ['Machilipatnam Town','Pedana','Bantumilli','Mopidevi'],
    'Vijayawada Urban':   ['Vijayawada Town','Benz Circle','Governorpet','Siddhartha Nagar'],
    'Vijayawada Rural':   ['Ajit Singh Nagar','Krishnalanka','Ramavarappadu','Vambay Colony'],
    'Nandigama':          ['Nandigama Town','Mylavaram','Vissannapeta','Jaggayyapeta Road'],
    'Gannavaram':         ['Gannavaram Town','Unguturu','Vuyyuru','Pedaparupudi'],
    'Pamarru':            ['Pamarru','Avanigadda','Kruthivennu','Nagayalanka'],
    'Vuyyuru':            ['Vuyyuru','Unguturu','Gampalagudem','Kondapalle'],
    'Avanigadda':         ['Avanigadda','Mopidevi','Nagayalanka','Pamarru Road'],
    'Nuzvid':             ['Nuzvid','Kaikaluru','Mudinepalle','Tiruvuru'],
    'Kaikaluru':          ['Kaikaluru','Pedaparupudi','Nidamanuru','Musunuru'],
    'Tiruvuru':           ['Tiruvuru','Gampalagudem','Vatsavai','A Konduru'],
    'Pedana':             ['Pedana','Machilipatnam Road','Bantumilli','Mopidevi Road'],
    'Bantumilli':         ['Bantumilli','Pedana Road','Machilipatnam Road','Kruthivennu Road'],
  },

  'Kurnool': {
    'Kurnool':            ['Kurnool Town','Bellary Road','Vaddageri','Budhawarpet'],
    'Adoni':              ['Adoni Town','Alur','Kosigi','Kowthalam'],
    'Dhone':              ['Dhone Town','Yemmiganur','Mantralayam','Panyam'],
    'Atmakur':            ['Atmakur','Gospadu','Peapully','Banaganapalle'],
    'Yemmiganur':         ['Yemmiganur','Mantralayam','Halaharvi','Koilakuntla'],
    'Pattikonda':         ['Pattikonda','Peapully','Alur','Maddikera'],
    'Kodumur':            ['Kodumur','Dornipadu','Nandavaram','Pattikonda Road'],
    'Alur':               ['Alur','Kosigi','Adoni Road','Kowthalam'],
    'Gudur':              ['Gudur','Devanakonda','Nandikotkur','Peapully'],
    'Nandikotkur':        ['Nandikotkur','Nandyal Road','Koilakuntla','Velugodu'],
    'Velugodu':           ['Velugodu','Nandyal Road','Srisailam Road','Kolimigundla'],
    'Kosigi':             ['Kosigi','Adoni Road','Alur','Kowthalam Road'],
    'Devanakonda':        ['Devanakonda','Gudur Road','Nandikotkur Road','Kurnool Road'],
    'Mantralayam':        ['Mantralayam','Dhone Road','Yemmiganur Road','Halaharvi'],
  },

  'Nandyal': {
    'Nandyal':            ['Nandyal Town','Sanjamala','Chagalamarri','Midthur'],
    'Allagadda':          ['Allagadda Town','Kolimigundla','Dornipadu','Uyyalawada'],
    'Srisailam':          ['Srisailam Town','Pattiseema','Dornala','Gundla Brahmeswaram'],
    'Atmakur':            ['Atmakur Town','Peapully','Banaganapalle','Nandyal Road'],
    'Betamcherla':        ['Betamcherla','Gospadu','Rudravaram','Nandyal Road'],
    'Koilakuntla':        ['Koilakuntla','Pagidyala','Sirvella','Owk'],
    'Markapur':           ['Markapur','Giddalur','Podili','Kanigiri'],
    'Giddalur':           ['Giddalur','Kandukur','Markapur Road','Tripuranthakam'],
    'Dornala':            ['Dornala','Kurnool Road','Srisailam Road','Wajid'],
    'Banaganapalle':      ['Banaganapalle','Panyam','Sirvel','Atmakur Road'],
    'Pagidyala':          ['Pagidyala','Koilakuntla Road','Owk','Sirvella'],
    'Kolimigundla':       ['Kolimigundla','Allagadda Road','Dornipadu','Uyyalawada Road'],
  },

  'NTR': {
    'Vijayawada':         ['Vijayawada One Town','Vijayawada Two Town','Ramavarappadu','Ibrahimpatnam'],
    'Nandigama':          ['Nandigama Town','Vissannapeta','Tiruvuru','A Konduru'],
    'Jaggayyapeta':       ['Jaggayyapeta Town','Gampalagudem','Vatsavai','Reddigudem'],
    'Mylavaram':          ['Mylavaram Town','Chandarlapadu','A Konduru','Nuzvid Road'],
    'Penamaluru':         ['Penamaluru','Ibrahimpatnam','Kankipadu','Gannavaram Road'],
    'Vuyyuru':            ['Vuyyuru','Unguturu','Kondapalle','Kanchikacherla'],
    'Kanchikacherla':     ['Kanchikacherla','Kondapalle','Musunuru','Nandivada'],
    'Chandarlapadu':      ['Chandarlapadu','Mylavaram','Gampalagudem','A Konduru'],
    'Vissannapeta':       ['Vissannapeta','Tiruvuru','Gampalagudem','Jaggayyapeta Road'],
    'A Konduru':          ['A Konduru','Mylavaram Road','Nandigama Road','Chandarlapadu'],
    'Kondapalle':         ['Kondapalle','Vuyyuru Road','Kanchikacherla Road','Ibrahimpatnam Road'],
    'Ibrahimpatnam':      ['Ibrahimpatnam','Vijayawada Road','Penamaluru','Kankipadu'],
  },

  'Palnadu': {
    'Narasaraopet':       ['Narasaraopet Town','Piduguralla','Gurazala','Karampudi'],
    'Macherla':           ['Macherla Town','Rentachintala','Dachepalle','Veldurthi'],
    'Vinukonda':          ['Vinukonda Town','Sattenapalle','Karampudi','Edlapadu'],
    'Gurazala':           ['Gurazala Town','Macherla Road','Dachepalle','Bollapalle'],
    'Piduguralla':        ['Piduguralla','Chilakaluripet','Sattenapalle','Pedakurapadu'],
    'Sattenapalle':       ['Sattenapalle','Chilakaluripet','Edlapadu','Amaravati Road'],
    'Rentachintala':      ['Rentachintala','Dachepalle','Macherla Road','Phirangipuram'],
    'Dachepalle':         ['Dachepalle','Rentachintala','Gurazala Road','Macherla Road'],
    'Karampudi':          ['Karampudi','Vinukonda','Gurazala','Narasaraopet Road'],
    'Bollapalle':         ['Bollapalle','Narasaraopet Road','Gurazala Road','Dachepalle'],
    'Edlapadu':           ['Edlapadu','Sattenapalle Road','Vinukonda Road','Chilakaluripet Road'],
    'Veldurthi':          ['Veldurthi','Macherla Road','Dachepalle Road','Rentachintala Road'],
  },

  'Parvathipuram Manyam': {
    'Parvathipuram':      ['Parvathipuram Town','Kurupam','Seethampeta','Santhakaviti'],
    'Salur':              ['Salur Town','Pachipenta','Makkuva','Komarada'],
    'Palakonda':          ['Palakonda Town','Hiramandalam','Seethanagaram','Vangara'],
    'Bobbili':            ['Bobbili Town','Rajam','Chipurupalle','Garividi'],
    'Seethampeta':        ['Seethampeta','Santhakaviti','Vangara','Kurupam Road'],
    'Kurupam':            ['Kurupam','Parvathipuram Road','Badangi','Komarada'],
    'Makkuva':            ['Makkuva','Komarada','Salur Road','Pachipenta'],
    'Jiyyammavalasa':     ['Jiyyammavalasa','Seethampeta Road','Vangara','Garividi Road'],
    'Gummalakshmipuram':  ['Gummalakshmipuram','Pachipenta','Salur Road','Makkuva'],
    'Bhamini':            ['Bhamini','Kurupam Road','Santhakaviti','Parvathipuram Road'],
    'Komarada':           ['Komarada','Salur Road','Makkuva','Pachipenta'],
    'Santhakaviti':       ['Santhakaviti','Seethampeta','Parvathipuram Road','Kurupam Road'],
  },

  'Prakasam': {
    'Ongole':             ['Ongole Town','Kothapatnam','Chirala Road','Kurnool Road'],
    'Kandukur':           ['Kandukur Town','Podili','Darsi','Markapur Road'],
    'Markapur':           ['Markapur Town','Giddalur','Cumbum','Kanigiri'],
    'Addanki':            ['Addanki','Karamchedu','Parchuru','Ballikurava'],
    'Chirala':            ['Chirala','Vetapalem','Repalle Road','Bapatla Road'],
    'Giddalur':           ['Giddalur','Kandukur Road','Markapur Road','Tripuranthakam'],
    'Darsi':              ['Darsi','Kandukur Road','Podili','Cumbum Road'],
    'Kanigiri':           ['Kanigiri','Podili','Darsi Road','Cumbum'],
    'Podili':             ['Podili','Kandukur','Darsi','Markapur Road'],
    'Cumbum':             ['Cumbum','Giddalur','Markapur','Yerragondapalem'],
    'Inkollu':            ['Inkollu','Santamagaluru','Martur','Chirala Road'],
    'Santamagaluru':      ['Santamagaluru','Inkollu','Martur','Chirala Road'],
    'Kothapatnam':        ['Kothapatnam','Ongole Road','Chirala Road','Repalle Road'],
    'Tripuranthakam':     ['Tripuranthakam','Giddalur Road','Markapur Road','Cumbum Road'],
  },

  'Sri Potti Sriramulu Nellore': {
    'Nellore':           ['Nellore Town','Kovur','Kavali','Gudur'],
    'Kavali':            ['Kavali Town','Dagadarthi','Bogole','Allur'],
    'Gudur':             ['Gudur Town','Chillakur','Kota','Vakadu'],
    'Atmakur':           ['Atmakur','Sangam','Anumasamudrampeta','Rapur'],
    'Sullurpeta':        ['Sullurpeta','Tada','Doravarisatram','Naidupeta'],
    'Venkatagiri':       ['Venkatagiri','Dakkili','Balayapalle','Kaluvoya'],
  },

  'Srikakulam': {
    'Srikakulam':         ['Srikakulam Town','Amadalavalasa','Etcherla','Palasa Road'],
    'Narasannapeta':      ['Narasannapeta Town','Sompeta','Mandasa','Ichapuram'],
    'Palasa':             ['Palasa Town','Vajrapukotturu','Kanchili','Ichapuram Road'],
    'Rajam':              ['Rajam Town','Gara','Kaviti','Narasannapeta Road'],
    'Tekkali':            ['Tekkali Town','Santhabommali','Jalumuru','Sompeta Road'],
    'Amadalavalasa':      ['Amadalavalasa','Etcherla','Srikakulam Road','Gara'],
    'Etcherla':           ['Etcherla','Srikakulam Road','Amadalavalasa','Kanchili'],
    'Sompeta':            ['Sompeta','Narasannapeta','Mandasa','Ichapuram'],
    'Mandasa':            ['Mandasa','Ichapuram','Palasa Road','Sompeta Road'],
    'Ichapuram':          ['Ichapuram','Narasannapeta','Palasa','Sompeta Road'],
    'Kaviti':             ['Kaviti','Rajam Road','Gara','Etcherla Road'],
    'Kanchili':           ['Kanchili','Palasa','Vajrapukotturu','Srikakulam Road'],
    'Vajrapukotturu':     ['Vajrapukotturu','Kanchili','Palasa Road','Narasannapeta Road'],
    'Gara':               ['Gara','Rajam Road','Amadalavalasa','Kaviti Road'],
  },

  'Sri Sathya Sai': {
    'Puttaparthi':        ['Puttaparthi Town','Bukkapatnam','Dharmavaram Road','Gorantla'],
    'Hindupur':           ['Hindupur Town','Penukonda','Madakasira','Lepakshi'],
    'Kadiri':             ['Kadiri Town','Nallamada','Tanakal','Obuladevaracheruvu'],
    'Lepakshi':           ['Lepakshi','Parigi','Somandepalle','Hindupur Road'],
    'Penukonda':          ['Penukonda Town','Rolla','Veldurthi','Hindupur Road'],
    'Madakasira':         ['Madakasira','Hindupur Road','Amadagur','Gorantla'],
    'Bukkapatnam':        ['Bukkapatnam','Puttaparthi Road','Dharmavaram Road','Ramagiri'],
    'Dharmavaram':        ['Dharmavaram Town','Bukkapatnam','Puttaparthi Road','Kanaganapalle'],
    'Parigi':             ['Parigi','Hindupur','Lepakshi','Somandepalle'],
    'Gorantla':           ['Gorantla','Puttaparthi Road','Bukkapatnam','Chilamathur'],
    'Tanakal':            ['Tanakal','Kadiri Road','Tadipatri Road','Dharmavaram Road'],
    'Nallamada':          ['Nallamada','Kadiri Road','Tanakal','Obuladevaracheruvu Road'],
  },

  'Tirupati': {
    'Tirupati':           ['Tirupati Town','Alipiri','Tiruchanur','Kapila Theertham'],
    'Srikalahasti':       ['Srikalahasti Town','Nagalapuram','Satyavedu','Sullurpeta'],
    'Chandragiri':        ['Chandragiri Town','Renigunta','Pakala Road','Varadaiahpalem'],
    'Puttur':             ['Puttur Town','Kuppam Road','Palamaner Road','Nagari Road'],
    'Naidupeta':          ['Naidupeta Town','Sullurpeta','Tada','Gudur Road'],
    'Renigunta':          ['Renigunta','Tirupati Road','Chandragiri Road','Settipalle'],
    'Pakala':             ['Pakala','Chittoor Road','Puttur Road','Tirupati Road'],
    'Nagari':             ['Nagari','Bangarupalem','Settipalle','Chittoor Road'],
    'Sullurpeta':         ['Sullurpeta','Tada','Naidupeta','Srikalahasti Road'],
    'Tada':               ['Tada','Sullurpeta','Naidupeta Road','Nellore Road'],
    'Tirupati Rural':     ['Renigunta Road','Alipiri Road','Tiruchanur Road','Chandragiri Road'],
    'Varadaiahpalem':     ['Varadaiahpalem','Chandragiri Road','Pakala Road','Puttur Road'],
    'Venkatagiri':        ['Venkatagiri','Naidupeta Road','Gudur Road','Sullurpeta Road'],
    'Satyavedu':          ['Satyavedu','Tada','Sullurpeta','Srikalahasti Road'],
  },

  'Visakhapatnam': {
    'Visakhapatnam':      ['Visakhapatnam Town','MVP Colony','Gajuwaka','Dwaraka Nagar'],
    'Bheemunipatnam':     ['Bheemunipatnam','Madhurawada','Rushikonda','Kommadi'],
    'Paderu':             ['Paderu Town','Araku Valley','Lambasingi','G Madugula'],
    'Narsipatnam':        ['Narsipatnam Town','Chintapalle','Koyyuru','Tyda'],
    'Gajuwaka':           ['Gajuwaka','Kommadi','Duvvada','Bheemunipatnam Road'],
    'Araku Valley':       ['Araku Valley','Paderu Road','Lambasingi','Ananthagiri'],
    'G Madugula':         ['G Madugula','Paderu Road','Narsipatnam Road','Chintapalle Road'],
    'Pendurthi':          ['Pendurthi','Bheemunipatnam Road','Kommadi','Maharanipeta'],
    'Ananthagiri':        ['Ananthagiri','Araku Valley','Lambasingi','Paderu Road'],
    'Duvvada':            ['Duvvada','Gajuwaka','Kommadi','Steel Plant Area'],
    'Chintapalle':        ['Chintapalle','Narsipatnam Road','G Madugula','Koyyuru'],
    'Koyyuru':            ['Koyyuru','Narsipatnam Road','Chintapalle','Tyda'],
    'Lambasingi':         ['Lambasingi','Araku Valley','Paderu Road','Ananthagiri'],
    'Chodavaram':         ['Chodavaram Vskp','Narsipatnam Road','Koyyuru Road','Chintapalle Road'],
  },

  'Vizianagaram': {
    'Vizianagaram':       ['Vizianagaram Town','Lakkavarapukota','Kothavalasa','Garividi'],
    'Bobbili':            ['Bobbili Town','Rajam','Cheepurupalle','Garividi'],
    'Nellimarla':         ['Nellimarla','Srungavarapukota','Jami','Kothavalasa'],
    'Srungavarapukota':   ['Srungavarapukota','Jami','Nellimarla','Vizianagaram Road'],
    'Cheepurupalle':      ['Cheepurupalle','Bobbili Road','Rajam Road','Chipurupalle'],
    'Garividi':           ['Garividi','Vizianagaram Road','Bobbili Road','Rajam Road'],
    'Dattirajeru':        ['Dattirajeru','Gajapathinagaram','Lakkavarapukota','Vizianagaram Road'],
    'Jami':               ['Jami','Nellimarla','Srungavarapukota','Vizianagaram Road'],
    'Bondapalle':         ['Bondapalle','Vizianagaram Road','Bobbili Road','Cheepurupalle Road'],
    'Gajapathinagaram':   ['Gajapathinagaram','Dattirajeru','Vizianagaram Road','Cheepurupalle'],
    'Ramabhadrapuram':    ['Ramabhadrapuram','Nellimarla Road','Jami','Kothavalasa'],
    'Lakkavarapukota':    ['Lakkavarapukota','Vizianagaram Town','Kothavalasa','Dattirajeru'],
    'Kothavalasa':        ['Kothavalasa','Vizianagaram Road','Nellimarla Road','Lakkavarapukota'],
    'Rajam Vizianagaram': ['Rajam','Gara','Bobbili Road','Cheepurupalle Road'],
  },

  'West Godavari': {
    'Bhimavaram':         ['Bhimavaram Town','Undi','Kalla','Attili'],
    'Narsapur':           ['Narsapur Town','Palakol','Akividu','Palakollu'],
    'Tadepalligudem':     ['Tadepalligudem Town','Kovvur','Nallajarla','Nidadavole'],
    'Palakollu':          ['Palakollu Town','Mogalthur','Nidadavole','Bhimavaram Road'],
    'Eluru':              ['Eluru Town','Denduluru','Kalidindi','Nidamanuru'],
    'Kovvur':             ['Kovvur','Nidadavole','Nallajarla','Tadepalligudem Road'],
    'Nidadavole':         ['Nidadavole','Nallajarla','Kovvur Road','Bhimavaram Road'],
    'Jangareddygudem':    ['Jangareddygudem','Buttayagudem','Polavaram','Velerupadu'],
    'Akividu':            ['Akividu','Narsapur Road','Palakol','Palakollu Road'],
    'Palakol':            ['Palakol','Narsapur Road','Akividu','Narasapur Junction'],
    'Attili':             ['Attili','Bhimavaram Road','Narsapur Road','Undi'],
    'Undi':               ['Undi','Bhimavaram','Attili','Palakol Road'],
    'Penugonda':          ['Penugonda','Bhimavaram Road','Narsapur Road','Attili Road'],
    'Mogalthur':          ['Mogalthur','Palakollu Road','Nidadavole','Nallajarla Road'],
  },

  'YSR Kadapa': {
    'Kadapa':             ['Kadapa Town','Yerraguntla','Kondapuram','Mydukur'],
    'Proddatur':          ['Proddatur Town','Muddanuru','Mydukur','Yerraguntla'],
    'Jammalamadugu':      ['Jammalamadugu Town','Duvvur','Thondur','Pulivendula Road'],
    'Pulivendula':        ['Pulivendula Town','Vempalle','Rajupalem','Badvel Road'],
    'Badvel':             ['Badvel Town','Sidhout','Porumamilla','Khajipet'],
    'Mydukur':            ['Mydukur','Proddatur Road','Kadapa Road','Yerraguntla'],
    'Sidhout':            ['Sidhout','Badvel Road','Porumamilla','Kadapa Road'],
    'Khajipet':           ['Khajipet','Badvel','Pulivendula Road','Kadapa Road'],
    'Vempalle':           ['Vempalle','Pulivendula Road','Jammalamadugu','Rajupalem'],
    'Porumamilla':        ['Porumamilla','Sidhout','Badvel Road','Kadapa Road'],
    'Duvvur':             ['Duvvur','Jammalamadugu Road','Pulivendula Road','Thondur'],
    'Kodur':              ['Kodur','Kadapa Road','Proddatur Road','Mydukur Road'],
    'Yerraguntla':        ['Yerraguntla','Kadapa Road','Kondapuram','Mydukur Road'],
    'Rajupalem':          ['Rajupalem','Pulivendula Road','Badvel Road','Vempalle Road'],
  },

};

const CATEGORIES = [
  { name: 'Healthcare', icon: '🏥' }, { name: 'Grocery', icon: '🛒' },
  { name: 'Vegetables', icon: '🥦' }, { name: 'Chicken & Meat', icon: '🍗' },
  { name: 'Bakery', icon: '🍞' },     { name: 'Milk & Dairy', icon: '🥛' },
  { name: 'Hotel & Food', icon: '🏨' },{ name: 'Hardware', icon: '🔧' },
  { name: 'Clothing', icon: '👗' },   { name: 'Electronics', icon: '📱' },
  { name: 'Salon', icon: '✂️' },      { name: 'Petrol Bunk', icon: '⛽' },
  { name: 'Services', icon: '🛠️' },  { name: 'Others', icon: '📦' },
];

async function main() {
  console.log('Seeding...');

  const apState = await prisma.state.upsert({
    where: { name: 'Andhra Pradesh' },
    update: {},
    create: { id: 1, name: 'Andhra Pradesh' },
  });

  // Batch insert all districts
  await prisma.district.createMany({
    data: Object.keys(AP_DATA).map(name => ({ name, stateId: apState.id })),
    skipDuplicates: true,
  });

  const dbDistricts = await prisma.district.findMany({ where: { stateId: apState.id } });
  const districtMap = Object.fromEntries(dbDistricts.map(d => [d.name, d.id]));
  console.log(`Districts: ${dbDistricts.length}`);

  // Batch insert all mandals
  const allMandals: { name: string; districtId: number }[] = [];
  for (const [distName, mandals] of Object.entries(AP_DATA)) {
    const distId = districtMap[distName];
    if (!distId) continue;
    for (const mandalName of Object.keys(mandals)) {
      allMandals.push({ name: mandalName, districtId: distId });
    }
  }
  await prisma.mandal.createMany({ data: allMandals, skipDuplicates: true });

  const dbMandals = await prisma.mandal.findMany();
  // Key: "districtId|mandalName" → mandalId
  const mandalMap = Object.fromEntries(dbMandals.map(m => [`${m.districtId}|${m.name}`, m.id]));
  console.log(`Mandals: ${dbMandals.length}`);

  // Batch insert all villages
  const allVillages: { name: string; mandalId: number }[] = [];
  for (const [distName, mandals] of Object.entries(AP_DATA)) {
    const distId = districtMap[distName];
    if (!distId) continue;
    for (const [mandalName, villages] of Object.entries(mandals)) {
      const mandalId = mandalMap[`${distId}|${mandalName}`];
      if (!mandalId) continue;
      for (const vName of villages) {
        allVillages.push({ name: vName, mandalId });
      }
    }
  }
  await prisma.village.createMany({ data: allVillages, skipDuplicates: true });
  console.log(`Villages: ${allVillages.length}`);

  // Categories
  await prisma.category.createMany({ data: CATEGORIES, skipDuplicates: true });
  console.log(`Categories: ${CATEGORIES.length}`);

  console.log('Done!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
