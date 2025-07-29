const infectionTips = {
  docx: "Word documents are often exploited by attackers using embedded macros or phishing tactics.",
  exe: "Executable files are dangerous because they can run arbitrary code when opened.",
  pdf: "PDFs are widely trusted, but can carry exploits in embedded scripts or links.",
  txt: "Plain text files are generally harmless — worms may ignore these.",
  default:
    "This file type is being infected, but it isn’t a common attack vector.",
};

export default infectionTips;
