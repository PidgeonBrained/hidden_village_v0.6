

export async function convertJsonToCsv(jsonFile, formattedGame, formattedStart, formattedEnd) {
    try {
        // Read JSON file content
        //const fileContent = await jsonFile.text();
        const jsonData = JSON.parse(jsonFile);
        
        // Headers for CSV
        const headers = [
            "UTC Time",
            "Unix Time Stamp",
            "ID",
            "ROLE",
            "GAME ID", 
            "GAME MODE",
            "DA Rep",
            "HINTS",
            "Hint Count",
            "Conj",
            "ETSS",
            "ETSLO",
            "Event Type",
            "TF Given Answer",
            "TF Correct",
            "MC Given Answer",
            "MC Correct",
            "Pose",
            "Start Match"
        ];

        // Process data
        const rows = [];
        // process nested structure
        for (const [date, dateData] of Object.entries(jsonData)) {
            for (const [role, roleData] of Object.entries(dateData)) {
                const userId = roleData.UserId ?? "null";
                
                for (const [timestamp, sessionData] of Object.entries(roleData)) {
                    if (timestamp === "UserId") continue; // Skip UserId entry
                    
                    // Extract game-level data
                    const daRep = sessionData.DaRep ?? "null";
                    const hintCount = sessionData.Hints?.HintCount ?? "null";
                    const latinSquareOrder = sessionData.LatinSquareOrder ?? "null";
                    
                    // Process each pose session
                    for (const [sessionId, sessionDetails] of Object.entries(sessionData)) {
                        if (sessionId === "DaRep" || sessionId === "GameStart" || 
                            sessionId === "GameStartGMT" || sessionId === "Hints" || 
                            sessionId === "LatinSquareOrder") continue;
                            
                        // Process poses
                        for (const [poseName, poseDetails] of Object.entries(sessionDetails)) {
                            if (poseName.startsWith("Pose") || poseName === "Intuition") {
                                rows.push({
                                    "UTC Time": poseDetails.StartGMT ?? "null",
                                    "Unix Time Stamp": poseDetails.Start ?? "null",
                                    "ID": userId,
                                    "ROLE": role,
                                    "GAME ID": sessionId,
                                    "GAME MODE": "default_mode",
                                    "DA Rep": daRep,
                                    "HINTS": "null",
                                    "Hint Count": hintCount,
                                    "Conj": "null",
                                    "ETSS": "null",
                                    "ETSLO": latinSquareOrder,
                                    "Event Type": "null",
                                    "TF Given Answer": "null",
                                    "TF Correct": "null",
                                    "MC Given Answer": "null",
                                    "MC Correct": "null",
                                    "Pose": poseName,
                                    "Start Match": poseDetails.MatchGMT ?? "null"
                                });
                            }
                        }
                    }
                }
            }
        }

        // Create CSV content
        const csvContent = [
            headers.join(','),
            ...rows.map(row => headers.map(header => `"${row[header] ?? "null"}"`).join(','))
        ].join('\n');

        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${formattedgame}_event_log_${formattedStart}_to_${formattedEnd}.csv`;
        link.click();
        URL.revokeObjectURL(url);

        return { success: true, rowCount: rows.length, csvContent: csvContent };
    } catch (error) {
        console.error('Conversion failed:', error);
        throw new Error(`Failed to convert file: ${error.message}`);
    }
}

// function extractPoses(conjectureData, gameId, userId, role, timestamp) {
//     return Object.entries(conjectureData).map(([pose, details]) => ({
//         "UTC Time": details.StartUTC ?? "null",
//         "Unix Time Stamp": details.Start ?? "null",
//         "ID": userId,
//         "ROLE": role,
//         "GAME ID": gameId,
//         "GAME MODE": "default_mode",
//         "DA Rep": "null",
//         "HINTS": "null",
//         "Hint Count": "null",
//         "Conj": "null",
//         "ETSS": "null",
//         "ETSLO": "null",
//         "Event Type": "null",
//         "TF Given Answer": "null",
//         "TF Correct": "null",
//         "MC Given Answer": "null",
//         "MC Correct": "null",
//         "Pose": pose,
//         "Start Match": details.MatchUTC ?? "null"
//     }));
// }



// const fs = require("fs");
// const os = require("os");
// const path = require("path");

// // Function to extract poses from conjecture data
// export function extractPoses(conjectureData, gameId, userId, role, timestamp) {
//     const rows = [];
//     for (const [pose, details] of Object.entries(conjectureData)) {
//         rows.push({
//             "UTC Time": details.StartUTC || "null",
//             "Unix Time Stamp": details.Start || "null",
//             "ID": userId || "null",
//             "ROLE": role || "null",
//             "GAME ID": gameId || "null",
//             "GAME MODE": "default_mode",
//             "DA Rep": "null",
//             "HINTS": "null",
//             "Pose": pose || "null",
//             "Start Match": details.MatchUTC || "null",
//         });
//     }
//     return rows;
// }
// // Function to map JSON data and convert to CSV
// export function mapAndConvertToCSV(jsonData) {
//     const rows = [];
//     const headers = [
//         "UTC Time",
//         "Unix Time Stamp",
//         "ID",
//         "ROLE",
//         "GAME ID",
//         "GAME MODE",
//         "DA Rep",
//         "HINTS",
//         "Pose",
//         "Start Match",
//     ];
//     // Extract poses from JSON data and add to rows
//     for (const [gameName, gameDetails] of Object.entries(jsonData)) {
//         const curricularId = gameDetails.CurricularID || "null";
//         for (const [date, dateDetails] of Object.entries(gameDetails)) {
//             if (typeof dateDetails === "object") {
//                 for (const [role, roleDetails] of Object.entries(dateDetails)) {
//                     const userId = roleDetails.UserId || "null";
//                     for (const [timestamp, sessionDetails] of Object.entries(
//                         roleDetails
//                     )) {
//                         if (typeof sessionDetails === "object") {
//                             const conjectureData =
//                                 sessionDetails.ConjectureId || {};
//                             rows.push(
//                                 ...extractPoses(
//                                     conjectureData,
//                                     curricularId,
//                                     userId,
//                                     role,
//                                     timestamp
//                                 )
//                             );
//                         }
//                     }
//                 }
//             }
//         }
//     }

//     // Create CSV content from rows
//     const csvContent =
//         headers.join(",") +
//         "\n" +
//         rows
//             .map((row) =>
//                 headers.map((header) => `"${row[header] || "null"}"`).join(",")
//             )
//             .join("\n");

//     // Save to Downloads folder
//     const downloadsPath = path.join(os.homedir(), "Downloads");
//     const outputPath = path.join(downloadsPath, "formatted_output.csv");

//     fs.writeFileSync(outputPath, csvContent);
//     console.log(`CSV file saved to ${outputPath}`);
// }

// // Main function to load JSON file and convert to CSV
// export function main() {
//     const inputFilePath = "C:/Users/adamc/Downloads/exported-json-data-2024-11-03T21-19-02.293Z.json"; // Update to your local JSON file path

//     // Load JSON file
//     const jsonData = JSON.parse(fs.readFileSync(inputFilePath, "utf-8"));

//     // Convert and save CSV
//     mapAndConvertToCSV(jsonData);
// }

// main();
