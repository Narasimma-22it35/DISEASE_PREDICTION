import { jsPDF } from 'jspdf';

/**
 * Generates a professional 4-page clinical report for HealthGuard AI
 */
export const generatePDFReport = (prediction, healthPlan) => {
  const doc = new jsPDF();
  const userName = prediction.patientId.name || 'Patient';
  const reportDate = new Date(prediction.createdAt).toLocaleDateString();
  const reportId = prediction._id.slice(-8).toUpperCase();

  // Helper: Draw Header
  const drawHeader = (pageNum) => {
    doc.setFillColor(79, 70, 229); // Blue-600
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('HealthGuard AI', 15, 25);
    doc.setFontSize(10);
    doc.text('Clinical Assessment Passport', 15, 32);
    doc.text(`Page ${pageNum} of 4`, 180, 25);
  };

  // PAGE 1: COVER & IDENTIFICATION
  drawHeader(1);
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(14);
  doc.text('PATIENT IDENTIFICATION', 15, 60);
  doc.setLineWidth(0.5);
  doc.line(15, 62, 195, 62);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Name: ${userName}`, 15, 75);
  doc.text(`Age: ${prediction.patientId.age} Years`, 15, 82);
  doc.text(`Gender: ${prediction.patientId.gender}`, 15, 89);
  doc.text(`Report date: ${reportDate}`, 120, 75);
  doc.text(`Report ID: #${reportId}`, 120, 82);

  // Health Score Circular Visualization (Mock)
  doc.setDrawColor(79, 70, 229);
  doc.setLineWidth(2);
  doc.circle(105, 130, 25, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('75', 105, 133, { align: 'center' });
  doc.setFontSize(10);
  doc.text('HEALTH SCORE', 105, 140, { align: 'center' });

  // Disease Summary Box
  doc.setFillColor(249, 250, 251);
  doc.rect(15, 170, 180, 40, 'F');
  doc.setDrawColor(229, 231, 235);
  doc.rect(15, 170, 180, 40, 'S');
  doc.setTextColor(31, 41, 55);
  doc.setFontSize(12);
  doc.text(`Primary Detected Condition: ${prediction.results[0].disease}`, 20, 185);
  doc.setFontSize(10);
  doc.setTextColor(239, 68, 68);
  doc.text(`Risk Probability: ${prediction.results[0].probability}%`, 20, 195);
  doc.setTextColor(107, 114, 128);
  doc.text(`Severity Level: ${healthPlan.riskLevel} Case`, 20, 202);

  // Disclaimer
  doc.setDrawColor(248, 113, 113);
  doc.setFillColor(254, 242, 242);
  doc.rect(15, 240, 180, 30, 'F');
  doc.rect(15, 240, 180, 30, 'S');
  doc.setTextColor(185, 28, 28);
  doc.setFontSize(8);
  doc.text('DISCLAIMER: This report is for informational purposes only and does not replace professional medical advice.', 20, 250);
  doc.text('Always consult a qualified medical professional for diagnosis and treatment.', 20, 255);

  // PAGE 2: CLINICAL ANALYSIS
  doc.addPage();
  drawHeader(2);
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(14);
  doc.text('DISEASE PROBABILITY & RISK FACTORS', 15, 60);
  doc.setLineWidth(0.5);
  doc.line(15, 62, 195, 62);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Risk Contributors (Top 3):', 15, 75);
  doc.setFont('helvetica', 'normal');
  prediction.riskFactors.slice(0, 3).forEach((rf, i) => {
    doc.text(`• ${rf.feature.replace('_', ' ')}: ${Math.round(rf.impact * 100)}% Impact`, 20, 85 + (i * 8));
  });

  doc.setFont('helvetica', 'bold');
  doc.text('Secondary Screenings:', 15, 120);
  doc.setFont('helvetica', 'normal');
  prediction.results.slice(1, 4).forEach((dp, i) => {
    doc.text(`- ${dp.disease}: ${dp.probability}% risk`, 20, 130 + (i * 8));
  });

  doc.setFont('helvetica', 'bold');
  doc.text('Specialist Recommendation:', 15, 170);
  doc.setFont('helvetica', 'normal');
  doc.text(`Field: ${healthPlan.disease} Specialist`, 20, 180);
  doc.text(`Urgency: ${healthPlan.severity}`, 20, 188);

  // PAGE 3: THERAPEUTIC PLAN
  doc.addPage();
  drawHeader(3);
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(14);
  doc.text('PERSONLIZED HEALTH STRATEGY', 15, 60);
  doc.setLineWidth(0.5);
  doc.line(15, 62, 195, 62);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Dietary Guidelines:', 15, 75);
  doc.setTextColor(22, 163, 74); // Green
  doc.text('RECOMMENDED:', 15, 85);
  doc.setFont('helvetica', 'normal');
  healthPlan.plan.recommended_foods.slice(0, 5).forEach((f, i) => {
    doc.text(`- ${f.name} (${f.how_much})`, 20, 95 + (i * 7));
  });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38); // Red
  doc.text('AVOID:', 120, 85);
  doc.setFont('helvetica', 'normal');
  healthPlan.plan.foods_to_avoid.slice(0, 5).forEach((f, i) => {
    doc.text(`- ${f.name}`, 125, 95 + (i * 7));
  });

  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('Daily Habit Integration (Do\'s):', 15, 150);
  doc.setFont('helvetica', 'normal');
  healthPlan.plan.dos.slice(0, 4).forEach((d, i) => {
    doc.text(`• ${d.action}`, 20, 160 + (i * 7));
  });

  doc.setFont('helvetica', 'bold');
  doc.text('Key Exercise Strategy:', 15, 200);
  doc.setFont('helvetica', 'normal');
  healthPlan.exercisesWithVideos.slice(0, 3).forEach((ex, i) => {
    doc.text(`${ex.name}: ${ex.frequency} (${ex.duration})`, 20, 210 + (i * 7));
  });

  // PAGE 4: MONITORING & ALERT LOGS
  doc.addPage();
  drawHeader(4);
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(14);
  doc.text('MONITORING & CRITICAL ALERTS', 15, 60);
  doc.line(15, 62, 195, 62);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(185, 28, 28);
  doc.text('IMMEDIATE WARNING SIGNS:', 15, 75);
  doc.setFont('helvetica', 'normal');
  healthPlan.plan.warning_signs.forEach((sign, i) => {
    doc.text(`- ${sign.sign}: ${sign.what_to_do}`, 20, 85 + (i * 8));
  });

  doc.setTextColor(50, 50, 50);
  doc.setFont('helvetica', 'bold');
  doc.text('Six-Month Monitoring Schedule:', 15, 140);
  doc.setFont('helvetica', 'normal');
  healthPlan.plan.monthly_checkups.slice(0, 6).forEach((check, i) => {
    doc.text(`${check.test}: ${check.frequency}`, 20, 150 + (i * 8));
  });

  doc.setFontSize(10);
  doc.setTextColor(156, 163, 175);
  doc.text(`Generated on ${new Date().toLocaleString()} by HealthGuard AI Neural Core.`, 105, 270, { align: 'center' });

  // SAVE
  doc.save(`HealthGuard_Report_${userName.replace(' ', '_')}_${reportId}.pdf`);
};
