// ATS Resume Analyzer Core Logic

export const COMMON_SKILLS = [
  // Technical Skills
  'javascript', 'python', 'java', 'react', 'node.js', 'nodejs', 'sql', 'html', 'css',
  'typescript', 'angular', 'vue', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
  'git', 'linux', 'mongodb', 'postgresql', 'mysql', 'redis', 'graphql', 'rest api',
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'data science',
  'excel', 'tableau', 'power bi', 'r', 'scala', 'spring boot', 'django', 'flask',
  'php', 'ruby', 'swift', 'kotlin', 'c++', 'c#', '.net', 'flutter', 'react native',

  // Soft Skills
  'communication', 'leadership', 'teamwork', 'problem solving', 'analytical',
  'project management', 'agile', 'scrum', 'critical thinking', 'collaboration',
  'time management', 'adaptability', 'creativity', 'attention to detail',

  // Business
  'marketing', 'sales', 'customer service', 'business development', 'strategy',
  'product management', 'ux', 'ui', 'design', 'figma', 'sketch', 'adobe',
];

export const SECTION_KEYWORDS = {
  experience: ['experience', 'work history', 'employment', 'professional background', 'career', 'positions held', 'work experience'],
  education: ['education', 'academic', 'degree', 'university', 'college', 'school', 'qualification', 'certification', 'certificate'],
  skills: ['skills', 'technical skills', 'competencies', 'technologies', 'tools', 'proficiencies', 'expertise'],
  summary: ['summary', 'objective', 'profile', 'about', 'overview', 'professional summary'],
  projects: ['projects', 'portfolio', 'work samples', 'accomplishments'],
  achievements: ['achievements', 'awards', 'honors', 'recognition', 'accomplishments'],
};

const ACTION_VERBS = [
  'led', 'managed', 'developed', 'created', 'implemented', 'designed', 'built',
  'improved', 'increased', 'reduced', 'achieved', 'delivered', 'launched',
  'collaborated', 'coordinated', 'analyzed', 'executed', 'spearheaded', 'drove',
  'optimized', 'streamlined', 'established', 'negotiated', 'mentored', 'trained',
];

export function extractText(rawText) {
  return rawText
    .replace(/\s+/g, ' ')
    .replace(/[^\x20-\x7E\n]/g, ' ')
    .trim();
}

export function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s.#+]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

export function detectSections(text) {
  const lowerText = text.toLowerCase();
  const detected = {};
  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS)) {
    detected[section] = keywords.some(kw => lowerText.includes(kw));
  }
  return detected;
}

export function extractJobKeywords(jobDescription) {
  if (!jobDescription || jobDescription.trim().length < 10) return [];
  const tokens = tokenize(jobDescription);
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'have', 'has', 'had', 'will', 'would', 'could', 'should', 'may', 'might',
    'that', 'this', 'these', 'those', 'we', 'you', 'our', 'your', 'their',
    'it', 'its', 'not', 'no', 'do', 'does', 'did', 'as', 'if', 'up', 'out',
    'than', 'then', 'so', 'yet', 'both', 'each', 'more', 'about', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'between',
    'very', 'just', 'also', 'can', 'such', 'other', 'all', 'any', 'most',
  ]);
  const freq = {};
  tokens.forEach(t => {
    if (!stopWords.has(t) && t.length > 2) {
      freq[t] = (freq[t] || 0) + 1;
    }
  });
  // Also look for bigrams
  const bigrams = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    const bigram = `${tokens[i]} ${tokens[i + 1]}`;
    if (!stopWords.has(tokens[i]) && !stopWords.has(tokens[i + 1])) {
      bigrams.push(bigram);
    }
  }
  const bigramFreq = {};
  bigrams.forEach(b => {
    bigramFreq[b] = (bigramFreq[b] || 0) + 1;
  });

  const topUnigrams = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([w]) => w);
  const topBigrams = Object.entries(bigramFreq)
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([b]) => b);

  return [...new Set([...topBigrams, ...topUnigrams])];
}

export function analyzeResume(resumeText, jobDescription = '') {
  const text = resumeText.toLowerCase();
  const tokens = tokenize(text);

  // Detect sections
  const sections = detectSections(resumeText);

  // Extract job-specific keywords
  const jobKeywords = extractJobKeywords(jobDescription);

  // Find matched/missing skills from common skills
  const matchedSkills = COMMON_SKILLS.filter(skill => text.includes(skill));
  const missingCommonSkills = COMMON_SKILLS.filter(s => !text.includes(s)).slice(0, 12);

  // Job-specific keyword matching
  let matchedJobKeywords = [];
  let missingJobKeywords = [];
  if (jobKeywords.length > 0) {
    matchedJobKeywords = jobKeywords.filter(kw => text.includes(kw));
    missingJobKeywords = jobKeywords.filter(kw => !text.includes(kw));
  }

  // Action verbs
  const usedActionVerbs = ACTION_VERBS.filter(v => text.includes(v));
  const missingActionVerbs = ACTION_VERBS.filter(v => !text.includes(v)).slice(0, 5);

  // Word count
  const wordCount = tokens.length;

  // Email & phone detection
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(\+?\d[\d\s\-().]{7,}\d)/.test(resumeText);
  const hasLinkedIn = /linkedin\.com/i.test(resumeText);

  // Quantified achievements
  const hasQuantifiedAchievements = /\d+%|\$\d+|\d+x|\d+\+|\d+ (users|customers|clients|projects|years|months)/i.test(resumeText);

  // Calculate ATS Score
  let score = 0;
  const breakdown = {};

  // 1. Contact info (15 pts)
  const contactScore = (hasEmail ? 7 : 0) + (hasPhone ? 5 : 0) + (hasLinkedIn ? 3 : 0);
  breakdown.contact = { score: contactScore, max: 15, label: 'Contact Information' };
  score += contactScore;

  // 2. Sections (20 pts)
  const sectionCount = Object.values(sections).filter(Boolean).length;
  const sectionScore = Math.min(20, sectionCount * 4);
  breakdown.sections = { score: sectionScore, max: 20, label: 'Resume Sections' };
  score += sectionScore;

  // 3. Skills match (25 pts)
  const skillMatchRatio = matchedSkills.length / COMMON_SKILLS.length;
  const skillScore = Math.round(Math.min(25, skillMatchRatio * 80));
  breakdown.skills = { score: skillScore, max: 25, label: 'Skills Coverage' };
  score += skillScore;

  // 4. Job keyword match (20 pts)
  let keywordScore = 10; // default if no JD
  if (jobKeywords.length > 0) {
    const jdMatchRatio = matchedJobKeywords.length / jobKeywords.length;
    keywordScore = Math.round(jdMatchRatio * 20);
  }
  breakdown.keywords = { score: keywordScore, max: 20, label: 'Job Keyword Match' };
  score += keywordScore;

  // 5. Content quality (20 pts)
  let contentScore = 0;
  if (wordCount >= 200) contentScore += 5;
  if (wordCount >= 400) contentScore += 3;
  if (usedActionVerbs.length >= 5) contentScore += 5;
  if (hasQuantifiedAchievements) contentScore += 5;
  if (hasLinkedIn) contentScore += 2;
  breakdown.content = { score: Math.min(20, contentScore), max: 20, label: 'Content Quality' };
  score += Math.min(20, contentScore);

  score = Math.min(100, score);

  // Suggestions
  const suggestions = [];
  if (!hasEmail) suggestions.push({ type: 'critical', text: 'Add your email address to the resume.' });
  if (!hasPhone) suggestions.push({ type: 'critical', text: 'Include a phone number for recruiters to contact you.' });
  if (!sections.summary) suggestions.push({ type: 'high', text: 'Add a Professional Summary section at the top.' });
  if (!sections.skills) suggestions.push({ type: 'high', text: 'Add a dedicated Skills section.' });
  if (!sections.experience) suggestions.push({ type: 'high', text: 'Include a Work Experience section.' });
  if (!sections.education) suggestions.push({ type: 'high', text: 'Add your Education details.' });
  if (!hasQuantifiedAchievements) suggestions.push({ type: 'high', text: 'Quantify achievements (e.g., "Increased sales by 30%", "Led team of 5").' });
  if (usedActionVerbs.length < 5) suggestions.push({ type: 'medium', text: `Use strong action verbs. Missing: ${missingActionVerbs.join(', ')}.` });
  if (!hasLinkedIn) suggestions.push({ type: 'medium', text: 'Add your LinkedIn profile URL.' });
  if (wordCount < 300) suggestions.push({ type: 'medium', text: 'Resume seems short. Aim for 400–700 words for a stronger impact.' });
  if (missingJobKeywords.length > 3 && jobKeywords.length > 0) {
    suggestions.push({ type: 'high', text: `Include these job-specific keywords: ${missingJobKeywords.slice(0, 5).join(', ')}.` });
  }
  if (matchedSkills.length < 8) suggestions.push({ type: 'medium', text: 'Add more relevant technical and soft skills.' });

  return {
    score,
    breakdown,
    sections,
    matchedSkills,
    missingCommonSkills,
    jobKeywords,
    matchedJobKeywords,
    missingJobKeywords,
    usedActionVerbs,
    wordCount,
    hasEmail,
    hasPhone,
    hasLinkedIn,
    hasQuantifiedAchievements,
    suggestions,
  };
}
