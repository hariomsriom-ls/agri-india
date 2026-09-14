import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import connectDB from "../src/db/index.js";
import { Country } from "../src/models/address/country.js";
import { State } from "../src/models/address/state.js";
import { District } from "../src/models/address/district.js";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const locationData = [
  {
    country: "India",
    states: [
        {name: "Andaman and Nicobar Islands",
         districts: ["Nicobars","North And Middle Andaman","South Andamans",],},

        {name: "Arunachal Pradesh",
            districts: ["Anjaw", "Bichom", "Changlang", "Dibang Valley", "East Kameng", "East Siang", "Kamle", "Keyi Panyor", 
                "Kra Daadi", "Kurung Kumey", "Leparada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri",
                "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang"],
        },
        {name: "Andhra Pradesh",
            districts: ["Alluri Sitharama Raju", "Anakapalli", "Ananthapuramu", "Annamayya", "Bapatla", "Chittoor", 
                "Dr. B.R. Ambedkar Konaseema", "East Godavari", "Eluru", "Guntur", "Kakinada", "Krishna", "Kurnool", "Markapuram", 
                "Nandyal", "Ntr", "Palnadu", "Parvathipuram Manyam", "Polavaram", "Prakasam", "Sri Potti Sriramulu Nellore", 
                "Sri Sathya Sai", "Srikakulam", "Tirupati", "Visakhapatnam", "Vizianagaram", "West Godavari", "Y.S.R. Kadapa"],
        },
        {name: "Assam",
        districts: ["Bajali", "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", 
            "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", 
            "Jorhat", "Kamrup", "Kamrup Metro", "Karbi Anglong", "Kokrajhar", "Lakhimpur", "Majuli", "Marigaon", "Nagaon", 
            "Nalbari", "Sivasagar", "Sonitpur", "South Salmara Mancachar", "Sribhumi", "Tamulpur", "Tinsukia", "Udalguri", "West Karbi Anglong"],
    },
      { name: "Bihar", 
        districts: ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", 
            "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur (Bhabua)", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", 
            "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Paschim Champaran", "Patna", "Purbi Champaran", 
            "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali"],
    },
        {name: "Chandigarh",
        districts: ["Chandigarh"],
    },
      { name: "Chhattisgarh", 
        districts: ["Balod", "Balodabazar-Bhatapara", "Balrampur-Ramanujganj", "Bastar", "Bemetara", "Bijapur", 
            "Bilaspur", "Dakshin Bastar Dantewada", "Dhamtari", "Durg", "Gariyaband", "Gaurela-Pendra-Marwahi", 
            "Janjgir-Champa", "Jashpur", "Kabeerdham", "Khairagarh-Chhuikhadan-Gandai", "Kondagaon", "Korba", "Korea", 
            "Mahasamund", "Manendragarh-Chirmiri-Bharatpur(M C B)", "Mohla-Manpur-Ambagarh Chouki", "Mungeli", "Narayanpur", 
            "Raigarh", "Raipur", "Rajnandgaon", "Sakti", "Sarangarh-Bilaigarh", "Sukma", "Surajpur", "Surguja", "Uttar Bastar Kanker"],
    },
        {name: "- Dadra and Nagar Haveli and Daman and Diu",
        districts: ["Dadra and Nagar Haveli", "Daman", "Diu"],
    },
      { name: "Delhi", 
        districts: ["Central", "Central North", "East", "New Delhi", "North", "North East", "North West", 
            "Old Delhi", "Outer North", "South", "South East", "South West", "West"],
    },
        {name: "Goa",
        districts: ["Kushavati", "North Goa", "South Goa"],
    },
      { name: "Gujarat", 
        districts: ["Ahmedabad", "Amreli", "Anand", "Arvalli", "Banas Kantha", "Bharuch", "Bhavnagar", "Botad", "Chhotaudepur",
             "Dahod", "Dangs", "Devbhumi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kachchh", "Kheda", 
             "Mahesana", "Mahisagar", "Morbi", "Narmada", "Navsari", "Panch Mahals", "Patan", "Porbandar", "Rajkot", 
             "Sabar Kantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad", "Vav-Tharad"],
    },
      { name: "Haryana", 
        districts: ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hansi", "Hisar", 
            "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", 
            "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
    },
        {name: "Himachal Pradesh",
        districts: ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul And Spiti", "Mandi", "Shimla", 
            "Sirmaur", "Solan", "Una"],
    },
      { name: "Jammu and Kashmir", 
        districts: ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", 
            "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
    },
        {name: "Jharkhand",
        districts: ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", 
            "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahebganj",
             "Saraikela Kharsawan", "Simdega", "West Singhbhum"],
    },
      { name: "Karnataka", 
        districts: ["Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru South", "Bengaluru Urban", "Bidar", "Chamarajanagar", 
            "Chikkaballapura", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", 
            "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", 
            "Vijayanagara", "Vijayapura", "Yadgir"],
    },
        {name: "Kerala",
       districts: ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad",
         "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
    },
      { name: "Ladakh", 
        districts: ["Kargil", "Leh Ladakh"],
    },
        {name: "Lakshadweep",
        districts: ["Lakshadweep"],
    },
      { name: "Madhya Pradesh", 
        districts: ["Agar-Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", 
            "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Indore", "Jabalpur", 
            "Jhabua", "Katni", "Khandwa (East Nimar)", "Khargone (West Nimar)", "MAUGANJ", "Maihar", "Mandla", "Mandsaur", "Morena", 
            "Narmadapuram", "Narsimhapur", "Neemuch", "Niwari", "Pandhurna", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", 
            "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", 
            "Umaria", "Vidisha"],
    },

      {name: "Maharashtra",
        districts: ["Ahilyanagar", "Akola", "Amravati", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Chhatrapati Sambhajinagar", "Dharashiv",
             "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai", "Mumbai Suburban", "Nagpur", "Nanded", 
             "Nandurbar", "Nashik", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", 
             "Washim", "Yavatmal"],
    },
      { name: "Manipur", 
        districts: ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", 
            "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
    },
     { name: "Meghalaya", 
        districts: ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "Eastern West Khasi Hills", "North Garo Hills", 
            "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", 
            "West Khasi Hills"],
    },
        {name: "Mizoram",
        districts: ["Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saitual", "Serchhip", 
            "Siaha"],
    },
      { name: "Nagaland", 
        districts: ["Chumoukedima", "Dimapur", "Kiphire", "Kohima", "Longleng", "Meluri", "Mokokchung", "Mon", "Niuland", "Noklak", 
            "Peren", "Phek", "Shamator", "Tseminyu", "Tuensang", "Wokha", "Zunheboto"],
    },
    {name: "Odisha",
        districts: ["Anugola", "Balangir", "Baleshwar", "Baragada", "Bhadrak", "Boudh", "Debagada", "Dhenkanal", "Gajapati", "Ganjam", 
            "Jagatsinghapur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamala", "Kataka", "Kendrapada", "Kendujhar", "Khordha", "Koraput",
             "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagada", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundaragada"],
    },
      {name: "Puducherry",
        districts: ["Karaikal", "Puducherry"],
    },
      { name: "Punjab", 
        districts: ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar",
             "Kapurthala", "Ludhiana", "Malerkotla", "Mansa", "Moga", "Pathankot", "Patiala", "Rupnagar", "S.A.S Nagar", "Sangrur", "Shahid Bhagat Singh Nagar", 
             "Sri Muktsar Sahib", "Tarn Taran"],
    },
     {name: "Rajasthan",
        districts: ["Ajmer", "Alwar", "Balotra", "Banswara", "Baran", "Barmer", "Beawar", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", 
            "Chittorgarh", "Churu", "Dausa", "Deeg", "Dholpur", "Didwana-Kuchaman", "Dungarpur", "Ganganagar", "Hanumangarh", "Jaipur", 
            "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Khairthal-Tijara", "Kota", "Kotputli-Behror", "Nagaur",
             "Pali", "Phalodi", "Pratapgarh", "Rajsamand", "Salumbar", "Sawai Madhopur", "Sikar", "Sirohi", "Tonk", "Udaipur"],
    },
      { name: "Sikkim", 
        districts: ["Gangtok", "Gyalshing", "Mangan", "Namchi", "Pakyong", "Soreng"],
    },

      {name: "Tamil Nadu",
        districts: ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi",
             "Kancheepuram", "Kanniyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Perambalur",
              "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "The Nilgiris", "Theni", "Thiruvallur", 
              "Thiruvarur", "Thoothukkudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvannamalai", "Vellore", "Viluppuram", 
              "Virudhunagar"],
    },
      { name: "Telangana", 
        districts: ["Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad", "Jagtial", "Jangoan", "Jayashankar Bhupalapally", 
            "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial",
             "Medak", "Medchal Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", 
             "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"],
    },
    { name: "Tripura", 
        districts: ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
    },
     {name: "Uttar Pradesh",
       districts: ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur",
         "Banda", "Bara Banki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", 
         "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", 
         "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", 
         "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Mahoba", "Mahrajganj", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", 
         "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Rae Bareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", 
         "Shamli", "Shrawasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
    },
      { name: "Uttarakhand", 
        districts: ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", 
            "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
    },

      {name: "West Bengal",
        districts: ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", 
            "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur",
             "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"],
    },
    ],
  },
];

const nextIds = new Map();

const findOrCreateLocation = async (Model, values) => {
  const existing = await Model.findOne(values);
  if (existing) {
    return existing;
  }

  const nextId = nextIds.get(Model.modelName) + 1;
  if (!Number.isSafeInteger(nextId)) {
    throw new Error(`Cannot generate a numeric ID for ${Model.modelName}`);
  }

  nextIds.set(Model.modelName, nextId);
  return Model.create({ _id: nextId, ...values });
};

const seedLocations = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from serverbackend/.env");
    }

    await connectDB();

    for (const Model of [Country, State, District]) {
      await Model.init();
      const lastRecord = await Model.findOne()
        .sort({ _id: -1 })
        .select("_id")
        .lean();
      nextIds.set(Model.modelName, lastRecord?._id ?? 0);
    }

    await State.collection.createIndex(
      { country: 1, name: 1 },
      { unique: true }
    );
    await District.collection.createIndex(
      { state: 1, name: 1 },
      { unique: true }
    );

    const districtIndexes = await District.collection.indexes();
    for (const index of districtIndexes) {
      if (
        index.unique &&
        index.key.name === 1 &&
        Object.keys(index.key).length === 1
      ) {
        await District.collection.dropIndex(index.name);
      }
    }

    for (const countryData of locationData) {
      const country = await findOrCreateLocation(Country, {
        name: countryData.country.trim(),
      });

      for (const stateData of countryData.states) {
        const state = await findOrCreateLocation(State, {
          name: stateData.name.trim(),
          country: country._id,
        });

        for (const districtName of stateData.districts) {
          await findOrCreateLocation(District, {
            name: districtName.trim(),
            state: state._id,
          });
        }
      }
    }

    console.log("Location data seeded successfully");
  } catch (error) {
    console.error("Location seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedLocations();
