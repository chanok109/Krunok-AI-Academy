/* =====================================================================
   คลังรูปภาพประกอบใบความรู้หน่วยที่ 1 (src/assets/images/unit1/)
   ===================================================================== */

import aiApplicationsImg from '../../../assets/images/unit1/ai_applications.jpg';
import aiBrainImg from '../../../assets/images/unit1/ai_brain.jpg';
import aiEthicsImg from '../../../assets/images/unit1/ai_ethics.jpg';
import aiLawImg from '../../../assets/images/unit1/ai_law.jpg';
import alanTuringImg from '../../../assets/images/unit1/alan.png';
import appAgricultureImg from '../../../assets/images/unit1/app_agriculture.jpg';
import appCommunicationImg from '../../../assets/images/unit1/app_communication.jpg';
import appEducationImg from '../../../assets/images/unit1/app_education.jpg';
import appEntertainmentImg from '../../../assets/images/unit1/app_entertainment.jpg';
import appFinanceImg from '../../../assets/images/unit1/app_finance.jpg';
import appHealthcareImg from '../../../assets/images/unit1/app_healthcare.jpg';
import appTransportationImg from '../../../assets/images/unit1/app_transportation.jpg';
import chatgptImg from '../../../assets/images/unit1/chatgpt.png';
import deepBlueImg from '../../../assets/images/unit1/deep_blue.png';
import johnMcCarthyImg from '../../../assets/images/unit1/John.jpg';
import russellNorvigImg from '../../../assets/images/unit1/russell_norvig_infographic.png';
import subfieldCvImg from '../../../assets/images/unit1/subfield_cv.jpg';
import subfieldNlpImg from '../../../assets/images/unit1/subfield_nlp.jpg';
import subfieldRoboticsImg from '../../../assets/images/unit1/subfield_robotics.jpg';
import subfieldSpeechImg from '../../../assets/images/unit1/subfield_speech.jpg';
import techAiImg from '../../../assets/images/unit1/tech_ai.jpg';
import techDlImg from '../../../assets/images/unit1/tech_dl.jpg';
import techGenaiImg from '../../../assets/images/unit1/tech_genai.jpg';
import techMlImg from '../../../assets/images/unit1/tech_ml.jpg';

const ASSET_BASE = import.meta.env.BASE_URL || './';

export const KS_IMAGES = {
  // ภาพรวมแนวคิดและสมองกล AI
  aiBrain: aiBrainImg,
  aiApplications: aiApplicationsImg,
  russellNorvig: russellNorvigImg,

  // บุคลากรและเหตุการณ์ประวัติศาสตร์ AI
  alanTuring: alanTuringImg,
  johnMcCarthy: johnMcCarthyImg,
  deepBlue: deepBlueImg,
  chatgpt: chatgptImg,

  // เทคโนโลยี 4 ชั้น (AI ⊃ ML ⊃ DL ⊃ GenAI)
  techAi: techAiImg,
  techMl: techMlImg,
  techDl: techDlImg,
  techGenai: techGenaiImg,

  // สาขาย่อยของ AI 4 ด้าน
  subfieldCv: subfieldCvImg,
  subfieldNlp: subfieldNlpImg,
  subfieldSpeech: subfieldSpeechImg,
  subfieldRobotics: subfieldRoboticsImg,

  // การประยุกต์ใช้ AI รอบตัวและอุตสาหกรรม
  appAgriculture: appAgricultureImg,
  appCommunication: appCommunicationImg,
  appEducation: appEducationImg,
  appEntertainment: appEntertainmentImg,
  appFinance: appFinanceImg,
  appHealthcare: appHealthcareImg,
  appTransportation: appTransportationImg,

  // จริยธรรม กฎหมาย และความปลอดภัยดิจิทัล
  aiEthics: aiEthicsImg,
  aiLaw: aiLawImg,
  deepfakeSafety: `${ASSET_BASE}assets/deepfake_safety_art.jpg`
};

