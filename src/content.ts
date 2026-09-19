export type Article = { id: string; section: string; label: string; title: string; kicker: string; summary: string; body: string[]; tags: string[] }

export const articles: Article[] = [
  {
    "id": "doc-1",
    "section": "How to Use This Document",
    "label": "001",
    "title": "How to Use This Document",
    "kicker": "Documentation section",
    "summary": "This document is intended to serve as a combined Game Requirements Document, Game Design Document, Narrative Design Bible, Technical Design Document, and production reference for a...",
    "body": [
      "This document is intended to serve as a combined Game Requirements Document, Game Design Document, Narrative Design Bible, Technical Design Document, and production reference for a story-heavy branching narrative game. Fill it in gradually; do not treat every section as something that must be completed before development begins.",
      "Keep the document as the source of truth for the game's intended behavior.",
      "Use IDs for characters, scenes, dialogue, choices, variables, assets, and endings.",
      "Update the document when major design decisions change.",
      "Use the databases/tables near the end for information that will become too large for prose.",
      "For a solo project, prioritize story structure, character state, story state, branching/consequences, and the vertical slice before filling out every production section."
    ],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-2",
    "section": "1. Game Overview",
    "label": "002",
    "title": "1. Game Overview",
    "kicker": "Documentation section",
    "summary": "Reference notes for 1. Game Overview.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-3",
    "section": "1. Game Overview",
    "label": "003",
    "title": "1.1 Basic Information",
    "kicker": "Section notes",
    "summary": "Working title",
    "body": [
      "Working title",
      "Genre",
      "Subgenre",
      "Target platforms",
      "Engine",
      "Target release date",
      "Target age rating",
      "Intended audience",
      "Camera perspective",
      "Single-player / multiplayer",
      "Offline / online requirements",
      "Target playtime",
      "Estimated number of chapters",
      "Estimated number of endings"
    ],
    "tags": [
      "1. Game Overview"
    ]
  },
  {
    "id": "doc-4",
    "section": "1. Game Overview",
    "label": "004",
    "title": "1.2 High-Level Game Description",
    "kicker": "Section notes",
    "summary": "One-paragraph game description",
    "body": [
      "One-paragraph game description",
      "Elevator pitch",
      "Core premise",
      "What makes the game unique",
      "Primary player fantasy",
      "Comparable games",
      "What the game takes inspiration from",
      "What the game explicitly does not want to copy"
    ],
    "tags": [
      "1. Game Overview"
    ]
  },
  {
    "id": "doc-5",
    "section": "1. Game Overview",
    "label": "005",
    "title": "1.3 Design Pillars",
    "kicker": "Section notes",
    "summary": "Define approximately 3â€“6 principles that guide design decisions.",
    "body": [
      "Define approximately 3â€“6 principles that guide design decisions.",
      "Example: Player choice matters",
      "Example: Characters feel human",
      "Example: Consequences are persistent",
      "Example: Exploration rewards curiosity",
      "Example: Story comes before combat"
    ],
    "tags": [
      "1. Game Overview"
    ]
  },
  {
    "id": "doc-6",
    "section": "2. Game Vision",
    "label": "006",
    "title": "2. Game Vision",
    "kicker": "Documentation section",
    "summary": "Reference notes for 2. Game Vision.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-7",
    "section": "2. Game Vision",
    "label": "007",
    "title": "2.1 Vision Statement",
    "kicker": "Section notes",
    "summary": "What experience should the player have?",
    "body": [
      "What experience should the player have?"
    ],
    "tags": [
      "2. Game Vision"
    ]
  },
  {
    "id": "doc-8",
    "section": "2. Game Vision",
    "label": "008",
    "title": "2.2 Emotional Goals",
    "kicker": "Section notes",
    "summary": "Fear",
    "body": [
      "Fear",
      "Suspense",
      "Curiosity",
      "Attachment",
      "Guilt",
      "Sadness",
      "Relief",
      "Anger",
      "Hope",
      "Other emotions"
    ],
    "tags": [
      "2. Game Vision"
    ]
  },
  {
    "id": "doc-9",
    "section": "2. Game Vision",
    "label": "009",
    "title": "2.3 Player Experience",
    "kicker": "Section notes",
    "summary": "Describe the intended experience from starting the game through exploration, choices, consequences, climax, and ending.",
    "body": [
      "Describe the intended experience from starting the game through exploration, choices, consequences, climax, and ending."
    ],
    "tags": [
      "2. Game Vision"
    ]
  },
  {
    "id": "doc-10",
    "section": "2. Game Vision",
    "label": "010",
    "title": "2.4 Game Identity",
    "kicker": "Section notes",
    "summary": "Visual identity",
    "body": [
      "Visual identity",
      "Narrative identity",
      "Audio identity",
      "Gameplay identity",
      "Tone",
      "Pacing"
    ],
    "tags": [
      "2. Game Vision"
    ]
  },
  {
    "id": "doc-11",
    "section": "3. Story Bible",
    "label": "011",
    "title": "3. Story Bible",
    "kicker": "Documentation section",
    "summary": "Reference notes for 3. Story Bible.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-12",
    "section": "3. Story Bible",
    "label": "012",
    "title": "3.1 Story Premise",
    "kicker": "Section notes",
    "summary": "Main premise",
    "body": [
      "Main premise",
      "Setting",
      "Time period",
      "Location",
      "Inciting incident",
      "Main conflict",
      "Central mystery, if any"
    ],
    "tags": [
      "3. Story Bible"
    ]
  },
  {
    "id": "doc-13",
    "section": "3. Story Bible",
    "label": "013",
    "title": "3.2 World",
    "kicker": "Section notes",
    "summary": "Geography",
    "body": [
      "Geography",
      "Town/city",
      "Important locations",
      "Schools",
      "Houses",
      "Businesses",
      "Roads",
      "Forests",
      "Organizations",
      "Social structures"
    ],
    "tags": [
      "3. Story Bible"
    ]
  },
  {
    "id": "doc-14",
    "section": "3. Story Bible",
    "label": "014",
    "title": "3.3 World Rules",
    "kicker": "Section notes",
    "summary": "What is possible?",
    "body": [
      "What is possible?",
      "What is impossible?",
      "Technology level",
      "Laws",
      "Social norms",
      "Supernatural rules, if applicable",
      "Historical events",
      "Important organizations"
    ],
    "tags": [
      "3. Story Bible"
    ]
  },
  {
    "id": "doc-15",
    "section": "4. Master Timeline",
    "label": "015",
    "title": "4. Master Timeline",
    "kicker": "Documentation section",
    "summary": "Reference notes for 4. Master Timeline.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-16",
    "section": "4. Master Timeline",
    "label": "016",
    "title": "4.1 Chronological Timeline",
    "kicker": "Section notes",
    "summary": "Events before the game",
    "body": [
      "Events before the game",
      "Character births",
      "Important relationships",
      "Historical events",
      "Previous incidents",
      "Main game events",
      "Events occurring off-screen",
      "Events caused by player decisions",
      "Events after each possible ending"
    ],
    "tags": [
      "4. Master Timeline"
    ]
  },
  {
    "id": "doc-17",
    "section": "5. Characters",
    "label": "017",
    "title": "5. Characters",
    "kicker": "Documentation section",
    "summary": "Reference notes for 5. Characters.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-18",
    "section": "5. Characters",
    "label": "018",
    "title": "5.1 Character Profile â€” repeat for every major character",
    "kicker": "Section notes",
    "summary": "Name",
    "body": [
      "Name",
      "Age",
      "Gender",
      "Occupation",
      "Location",
      "Role in story",
      "First appearance",
      "Last possible appearance",
      "Playable?",
      "Can die?",
      "Can disappear?",
      "Can become hostile?",
      "Can become romantic?",
      "Can betray another character?",
      "Can save another character?",
      "Conditions for survival/death"
    ],
    "tags": [
      "5. Characters"
    ]
  },
  {
    "id": "doc-19",
    "section": "5. Characters",
    "label": "019",
    "title": "5.2 Personality",
    "kicker": "Section notes",
    "summary": "Personality traits",
    "body": [
      "Personality traits",
      "Strengths",
      "Weaknesses",
      "Fears",
      "Desires",
      "Beliefs",
      "Values",
      "Secrets",
      "Habits",
      "Likes/dislikes"
    ],
    "tags": [
      "5. Characters"
    ]
  },
  {
    "id": "doc-20",
    "section": "5. Characters",
    "label": "020",
    "title": "5.3 Background",
    "kicker": "Section notes",
    "summary": "Childhood",
    "body": [
      "Childhood",
      "Family",
      "Education",
      "Past events",
      "Relationships",
      "Trauma",
      "Important life events"
    ],
    "tags": [
      "5. Characters"
    ]
  },
  {
    "id": "doc-21",
    "section": "5. Characters",
    "label": "021",
    "title": "5.4 Character Arc",
    "kicker": "Section notes",
    "summary": "Starting state",
    "body": [
      "Starting state",
      "What they want",
      "What they need",
      "Internal conflict",
      "External conflict",
      "Character development",
      "Possible outcomes"
    ],
    "tags": [
      "5. Characters"
    ]
  },
  {
    "id": "doc-22",
    "section": "5. Characters",
    "label": "022",
    "title": "5.5 Character Relationships",
    "kicker": "Section notes",
    "summary": "Document friendship, trust, romance, fear, suspicion, respect, loyalty, hatred, and other relationships.",
    "body": [
      "Document friendship, trust, romance, fear, suspicion, respect, loyalty, hatred, and other relationships."
    ],
    "tags": [
      "5. Characters"
    ]
  },
  {
    "id": "doc-23",
    "section": "6. Character Relationship System",
    "label": "023",
    "title": "6. Character Relationship System",
    "kicker": "Documentation section",
    "summary": "Reference notes for 6. Character Relationship System.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-24",
    "section": "6. Character Relationship System",
    "label": "024",
    "title": "6.1 Relationship Types",
    "kicker": "Section notes",
    "summary": "Friendship",
    "body": [
      "Friendship",
      "Trust",
      "Romance",
      "Fear",
      "Suspicion",
      "Respect",
      "Loyalty",
      "Hatred"
    ],
    "tags": [
      "6. Character Relationship System"
    ]
  },
  {
    "id": "doc-25",
    "section": "6. Character Relationship System",
    "label": "025",
    "title": "6.2 Relationship Changes",
    "kicker": "Section notes",
    "summary": "What actions change each value?",
    "body": [
      "What actions change each value?",
      "Are values numerical, boolean, hidden variables, or dialogue-state based?",
      "What thresholds trigger different scenes or dialogue?"
    ],
    "tags": [
      "6. Character Relationship System"
    ]
  },
  {
    "id": "doc-26",
    "section": "7. Narrative Structure",
    "label": "026",
    "title": "7. Narrative Structure",
    "kicker": "Documentation section",
    "summary": "Reference notes for 7. Narrative Structure.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-27",
    "section": "7. Narrative Structure",
    "label": "027",
    "title": "7.1 Acts",
    "kicker": "Section notes",
    "summary": "Define the major acts of the story.",
    "body": [
      "Define the major acts of the story."
    ],
    "tags": [
      "7. Narrative Structure"
    ]
  },
  {
    "id": "doc-28",
    "section": "7. Narrative Structure",
    "label": "028",
    "title": "7.2 Chapters / Episodes",
    "kicker": "Section notes",
    "summary": "For each chapter document: purpose, locations, characters involved, story events, gameplay, important dialogue, choices, consequences, required assets, possible deaths, branches, a...",
    "body": [
      "For each chapter document: purpose, locations, characters involved, story events, gameplay, important dialogue, choices, consequences, required assets, possible deaths, branches, and end state."
    ],
    "tags": [
      "7. Narrative Structure"
    ]
  },
  {
    "id": "doc-29",
    "section": "8. Branching Narrative System",
    "label": "029",
    "title": "8. Branching Narrative System",
    "kicker": "Documentation section",
    "summary": "Reference notes for 8. Branching Narrative System.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-30",
    "section": "8. Branching Narrative System",
    "label": "030",
    "title": "8.1 Branch Map",
    "kicker": "Section notes",
    "summary": "Choices",
    "body": [
      "Choices",
      "Conditions",
      "Branches",
      "Convergence points",
      "Permanent consequences",
      "Temporary consequences",
      "Hidden consequences",
      "Character deaths",
      "Dialogue changes",
      "Inventory changes",
      "World-state changes",
      "Ending implications"
    ],
    "tags": [
      "8. Branching Narrative System"
    ]
  },
  {
    "id": "doc-31",
    "section": "8. Branching Narrative System",
    "label": "031",
    "title": "8.2 Branching Philosophy",
    "kicker": "Section notes",
    "summary": "Decide how much the story branches versus reconverges.",
    "body": [
      "Decide how much the story branches versus reconverges.",
      "Document which choices create genuinely different scenes and which only modify details."
    ],
    "tags": [
      "8. Branching Narrative System"
    ]
  },
  {
    "id": "doc-32",
    "section": "9. Choice Design",
    "label": "032",
    "title": "9. Choice Design",
    "kicker": "Documentation section",
    "summary": "Reference notes for 9. Choice Design.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-33",
    "section": "9. Choice Design",
    "label": "033",
    "title": "9.1 Choice Types",
    "kicker": "Section notes",
    "summary": "Dialogue choice",
    "body": [
      "Dialogue choice",
      "Moral choice",
      "Investigation choice",
      "Timed choice",
      "Relationship choice",
      "Sacrifice choice",
      "Puzzle choice",
      "Action choice"
    ],
    "tags": [
      "9. Choice Design"
    ]
  },
  {
    "id": "doc-34",
    "section": "9. Choice Design",
    "label": "034",
    "title": "9.2 Choice Specification",
    "kicker": "Section notes",
    "summary": "Choice ID",
    "body": [
      "Choice ID",
      "Chapter",
      "Scene",
      "Available options",
      "Time limit",
      "What the player knows",
      "What the player does not know",
      "Immediate consequence",
      "Delayed consequence",
      "Permanent consequence",
      "Characters affected",
      "Locations affected",
      "Future scenes affected",
      "Ending implications"
    ],
    "tags": [
      "9. Choice Design"
    ]
  },
  {
    "id": "doc-35",
    "section": "10. Decision / State System",
    "label": "035",
    "title": "10. Decision / State System",
    "kicker": "Documentation section",
    "summary": "Reference notes for 10. Decision / State System.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-36",
    "section": "10. Decision / State System",
    "label": "036",
    "title": "10.1 Narrative Variables",
    "kicker": "Section notes",
    "summary": "Variable name",
    "body": [
      "Variable name",
      "Type",
      "Default value",
      "What changes it",
      "What reads it",
      "What it affects"
    ],
    "tags": [
      "10. Decision / State System"
    ]
  },
  {
    "id": "doc-37",
    "section": "10. Decision / State System",
    "label": "037",
    "title": "10.2 Example Variables",
    "kicker": "Section notes",
    "summary": "character_alive",
    "body": [
      "character_alive",
      "trust_character",
      "relationship_character",
      "found_item",
      "knows_truth",
      "investigated_location",
      "betrayed_character"
    ],
    "tags": [
      "10. Decision / State System"
    ]
  },
  {
    "id": "doc-38",
    "section": "11. Story Flowcharts",
    "label": "038",
    "title": "11. Story Flowcharts",
    "kicker": "Documentation section",
    "summary": "Reference notes for 11. Story Flowcharts.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-39",
    "section": "11. Story Flowcharts",
    "label": "039",
    "title": "11.1 Main Story Flow",
    "kicker": "Section notes",
    "summary": "Create a visual flowchart showing chapters, choices, branches, convergence points, and endings.",
    "body": [
      "Create a visual flowchart showing chapters, choices, branches, convergence points, and endings."
    ],
    "tags": [
      "11. Story Flowcharts"
    ]
  },
  {
    "id": "doc-40",
    "section": "11. Story Flowcharts",
    "label": "040",
    "title": "11.2 Character Fate Flow",
    "kicker": "Section notes",
    "summary": "For each major character document survival, injury, capture, disappearance, death, and other possible states.",
    "body": [
      "For each major character document survival, injury, capture, disappearance, death, and other possible states."
    ],
    "tags": [
      "11. Story Flowcharts"
    ]
  },
  {
    "id": "doc-41",
    "section": "11. Story Flowcharts",
    "label": "041",
    "title": "11.3 Ending Flow",
    "kicker": "Section notes",
    "summary": "Document every possible ending and the conditions required to reach it.",
    "body": [
      "Document every possible ending and the conditions required to reach it."
    ],
    "tags": [
      "11. Story Flowcharts"
    ]
  },
  {
    "id": "doc-42",
    "section": "12. Endings",
    "label": "042",
    "title": "12. Endings",
    "kicker": "Documentation section",
    "summary": "Reference notes for 12. Endings.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-43",
    "section": "12. Endings",
    "label": "043",
    "title": "12.1 Ending Bible",
    "kicker": "Section notes",
    "summary": "Ending ID",
    "body": [
      "Ending ID",
      "Ending name",
      "Conditions",
      "Survivors",
      "Dead characters",
      "Relationships",
      "Major decisions",
      "Final scenes",
      "Epilogue",
      "Post-credit scene",
      "Ending variations"
    ],
    "tags": [
      "12. Endings"
    ]
  },
  {
    "id": "doc-44",
    "section": "12. Endings",
    "label": "044",
    "title": "12.2 Ending Types",
    "kicker": "Section notes",
    "summary": "Completely different endings",
    "body": [
      "Completely different endings",
      "Variations of the same ending",
      "Character-specific endings",
      "Hidden endings"
    ],
    "tags": [
      "12. Endings"
    ]
  },
  {
    "id": "doc-45",
    "section": "13. Scene Documentation",
    "label": "045",
    "title": "13. Scene Documentation",
    "kicker": "Documentation section",
    "summary": "Reference notes for 13. Scene Documentation.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-46",
    "section": "13. Scene Documentation",
    "label": "046",
    "title": "13.1 Scene Template",
    "kicker": "Section notes",
    "summary": "Scene ID",
    "body": [
      "Scene ID",
      "Scene name",
      "Chapter",
      "Location",
      "Characters",
      "Purpose",
      "Starting conditions",
      "Events",
      "Player interaction",
      "Choices",
      "State changes",
      "Exit conditions",
      "Possible branches",
      "Required assets",
      "Audio requirements",
      "Animation requirements",
      "Cinematic requirements"
    ],
    "tags": [
      "13. Scene Documentation"
    ]
  },
  {
    "id": "doc-47",
    "section": "14. Dialogue Bible",
    "label": "047",
    "title": "14. Dialogue Bible",
    "kicker": "Documentation section",
    "summary": "Reference notes for 14. Dialogue Bible.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-48",
    "section": "14. Dialogue Bible",
    "label": "048",
    "title": "14.1 Dialogue Data",
    "kicker": "Section notes",
    "summary": "Dialogue ID",
    "body": [
      "Dialogue ID",
      "Speaker",
      "Scene",
      "Text",
      "Conditions",
      "Choices",
      "Branches",
      "Relationship changes",
      "Voice acting requirements",
      "Localization requirements"
    ],
    "tags": [
      "14. Dialogue Bible"
    ]
  },
  {
    "id": "doc-49",
    "section": "14. Dialogue Bible",
    "label": "049",
    "title": "14.2 Dialogue Conventions",
    "kicker": "Section notes",
    "summary": "Naming",
    "body": [
      "Naming",
      "Formatting",
      "Speaker tags",
      "Emotion tags",
      "Voice direction",
      "Localization notes"
    ],
    "tags": [
      "14. Dialogue Bible"
    ]
  },
  {
    "id": "doc-50",
    "section": "15. Gameplay Design",
    "label": "050",
    "title": "15. Gameplay Design",
    "kicker": "Documentation section",
    "summary": "Reference notes for 15. Gameplay Design.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-51",
    "section": "15. Gameplay Design",
    "label": "051",
    "title": "15.1 Core Gameplay Loop",
    "kicker": "Section notes",
    "summary": "Define the repeated player loop, e.g. Explore â†’ Discover â†’ Interact â†’ Decide â†’ Experience consequence â†’ Continue story.",
    "body": [
      "Define the repeated player loop, e.g. Explore â†’ Discover â†’ Interact â†’ Decide â†’ Experience consequence â†’ Continue story."
    ],
    "tags": [
      "15. Gameplay Design"
    ]
  },
  {
    "id": "doc-52",
    "section": "15. Gameplay Design",
    "label": "052",
    "title": "15.2 Player Actions",
    "kicker": "Section notes",
    "summary": "Walk",
    "body": [
      "Walk",
      "Run",
      "Inspect",
      "Interact",
      "Talk",
      "Investigate",
      "Pick up items",
      "Use items",
      "Hide",
      "Chase",
      "Escape",
      "Fight if applicable",
      "QTEs",
      "Dialogue choices"
    ],
    "tags": [
      "15. Gameplay Design"
    ]
  },
  {
    "id": "doc-53",
    "section": "16. Exploration System",
    "label": "053",
    "title": "16. Exploration System",
    "kicker": "Documentation section",
    "summary": "Reference notes for 16. Exploration System.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-54",
    "section": "16. Exploration System",
    "label": "054",
    "title": "16.1 Exploration Features",
    "kicker": "Section notes",
    "summary": "Movement",
    "body": [
      "Movement",
      "Camera",
      "Interaction system",
      "Interactable highlighting",
      "Investigation",
      "Collectibles",
      "Environmental storytelling",
      "Optional conversations",
      "Hidden areas",
      "Locked areas",
      "Backtracking",
      "Exploration rewards"
    ],
    "tags": [
      "16. Exploration System"
    ]
  },
  {
    "id": "doc-55",
    "section": "17. QTE System",
    "label": "055",
    "title": "17. QTE System",
    "kicker": "Documentation section",
    "summary": "Reference notes for 17. QTE System.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-56",
    "section": "17. QTE System",
    "label": "056",
    "title": "17.1 QTE Design",
    "kicker": "Section notes",
    "summary": "Types of QTEs",
    "body": [
      "Types of QTEs",
      "Button prompts",
      "Timing",
      "Failure",
      "Success",
      "Partial success",
      "Consequences",
      "Accessibility options",
      "Difficulty"
    ],
    "tags": [
      "17. QTE System"
    ]
  },
  {
    "id": "doc-57",
    "section": "18. Death System",
    "label": "057",
    "title": "18. Death System",
    "kicker": "Documentation section",
    "summary": "Reference notes for 18. Death System.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-58",
    "section": "18. Death System",
    "label": "058",
    "title": "18.1 Character Death Rules",
    "kicker": "Section notes",
    "summary": "Who can die?",
    "body": [
      "Who can die?",
      "When can they die?",
      "What causes death?",
      "Can death be prevented?",
      "Is death permanent?",
      "Can characters die differently?",
      "How does the story continue after death?",
      "How does dialogue change?",
      "How does the ending change?"
    ],
    "tags": [
      "18. Death System"
    ]
  },
  {
    "id": "doc-59",
    "section": "19. Save System",
    "label": "059",
    "title": "19. Save System",
    "kicker": "Documentation section",
    "summary": "Reference notes for 19. Save System.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-60",
    "section": "19. Save System",
    "label": "060",
    "title": "19.1 Save Design",
    "kicker": "Section notes",
    "summary": "Autosave",
    "body": [
      "Autosave",
      "Manual saves",
      "Chapter saves",
      "Checkpoints",
      "Save slots",
      "Save/load behavior",
      "Death retry",
      "Chapter replay",
      "Choice replay",
      "Whether choices persist across chapter replay"
    ],
    "tags": [
      "19. Save System"
    ]
  },
  {
    "id": "doc-61",
    "section": "20. Game Systems",
    "label": "061",
    "title": "20. Game Systems",
    "kicker": "Documentation section",
    "summary": "Reference notes for 20. Game Systems.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-62",
    "section": "20. Game Systems",
    "label": "062",
    "title": "20.1 Player",
    "kicker": "Section notes",
    "summary": "Movement",
    "body": [
      "Movement",
      "Camera",
      "Interaction",
      "Inventory",
      "Health",
      "Sprinting"
    ],
    "tags": [
      "20. Game Systems"
    ]
  },
  {
    "id": "doc-63",
    "section": "20. Game Systems",
    "label": "063",
    "title": "20.2 Narrative",
    "kicker": "Section notes",
    "summary": "Dialogue",
    "body": [
      "Dialogue",
      "Choices",
      "Branching",
      "State variables",
      "Cutscenes",
      "Triggers"
    ],
    "tags": [
      "20. Game Systems"
    ]
  },
  {
    "id": "doc-64",
    "section": "20. Game Systems",
    "label": "064",
    "title": "20.3 AI",
    "kicker": "Section notes",
    "summary": "NPC behavior",
    "body": [
      "NPC behavior",
      "Following",
      "Conversation",
      "Investigation",
      "Enemy AI if applicable"
    ],
    "tags": [
      "20. Game Systems"
    ]
  },
  {
    "id": "doc-65",
    "section": "20. Game Systems",
    "label": "065",
    "title": "20.4 Interaction",
    "kicker": "Section notes",
    "summary": "Doors",
    "body": [
      "Doors",
      "Objects",
      "Pickups",
      "Environmental interactions"
    ],
    "tags": [
      "20. Game Systems"
    ]
  },
  {
    "id": "doc-66",
    "section": "20. Game Systems",
    "label": "066",
    "title": "20.5 Audio",
    "kicker": "Section notes",
    "summary": "Music",
    "body": [
      "Music",
      "Ambience",
      "Footsteps",
      "Voice",
      "VFX/audio synchronization"
    ],
    "tags": [
      "20. Game Systems"
    ]
  },
  {
    "id": "doc-67",
    "section": "21. UI / UX",
    "label": "067",
    "title": "21. UI / UX",
    "kicker": "Documentation section",
    "summary": "Reference notes for 21. UI / UX.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-68",
    "section": "21. UI / UX",
    "label": "068",
    "title": "21.1 Screens",
    "kicker": "Section notes",
    "summary": "Main Menu",
    "body": [
      "Main Menu",
      "New Game",
      "Continue",
      "Load",
      "Settings",
      "Extras",
      "Pause Menu",
      "Credits"
    ],
    "tags": [
      "21. UI / UX"
    ]
  },
  {
    "id": "doc-69",
    "section": "21. UI / UX",
    "label": "069",
    "title": "21.2 In-game UI",
    "kicker": "Section notes",
    "summary": "Interaction prompt",
    "body": [
      "Interaction prompt",
      "Dialogue choices",
      "QTE prompts",
      "Notifications",
      "Inventory",
      "Objectives",
      "Subtitles"
    ],
    "tags": [
      "21. UI / UX"
    ]
  },
  {
    "id": "doc-70",
    "section": "21. UI / UX",
    "label": "070",
    "title": "21.3 Settings",
    "kicker": "Section notes",
    "summary": "Graphics",
    "body": [
      "Graphics",
      "Audio",
      "Controls",
      "Accessibility",
      "Subtitles",
      "Language"
    ],
    "tags": [
      "21. UI / UX"
    ]
  },
  {
    "id": "doc-71",
    "section": "22. Accessibility",
    "label": "071",
    "title": "22. Accessibility",
    "kicker": "Documentation section",
    "summary": "Reference notes for 22. Accessibility.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-72",
    "section": "22. Accessibility",
    "label": "072",
    "title": "22.1 Accessibility Options",
    "kicker": "Section notes",
    "summary": "Subtitle size",
    "body": [
      "Subtitle size",
      "Subtitle background",
      "Speaker names",
      "Colorblind options",
      "QTE alternatives",
      "QTE timing",
      "Hold vs mash buttons",
      "Camera shake",
      "Motion blur",
      "FOV",
      "Audio controls",
      "Text speed",
      "Difficulty options",
      "Remappable controls"
    ],
    "tags": [
      "22. Accessibility"
    ]
  },
  {
    "id": "doc-73",
    "section": "23. Camera Design",
    "label": "073",
    "title": "23. Camera Design",
    "kicker": "Documentation section",
    "summary": "Reference notes for 23. Camera Design.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-74",
    "section": "23. Camera Design",
    "label": "074",
    "title": "23.1 Camera Types",
    "kicker": "Section notes",
    "summary": "Player camera",
    "body": [
      "Player camera",
      "Exploration camera",
      "Dialogue camera",
      "Cinematic camera",
      "Cutscene camera"
    ],
    "tags": [
      "23. Camera Design"
    ]
  },
  {
    "id": "doc-75",
    "section": "23. Camera Design",
    "label": "075",
    "title": "23.2 Camera Behavior",
    "kicker": "Section notes",
    "summary": "Transitions",
    "body": [
      "Transitions",
      "Camera shake",
      "FOV",
      "Collision",
      "Fixed cameras if applicable"
    ],
    "tags": [
      "23. Camera Design"
    ]
  },
  {
    "id": "doc-76",
    "section": "24. Animation",
    "label": "076",
    "title": "24. Animation",
    "kicker": "Documentation section",
    "summary": "Reference notes for 24. Animation.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-77",
    "section": "24. Animation",
    "label": "077",
    "title": "24.1 Animation Requirements",
    "kicker": "Section notes",
    "summary": "Locomotion",
    "body": [
      "Locomotion",
      "Idle",
      "Walking",
      "Running",
      "Sitting",
      "Talking",
      "Gestures",
      "Emotional animations",
      "Combat",
      "Death",
      "Injuries",
      "Contextual animations"
    ],
    "tags": [
      "24. Animation"
    ]
  },
  {
    "id": "doc-78",
    "section": "24. Animation",
    "label": "078",
    "title": "24.2 Animation Technology",
    "kicker": "Section notes",
    "summary": "Humanoid vs Generic",
    "body": [
      "Humanoid vs Generic",
      "Retargeting",
      "Mixamo",
      "Motion capture",
      "Animation layers",
      "Blend trees",
      "IK",
      "Foot IK",
      "Root motion"
    ],
    "tags": [
      "24. Animation"
    ]
  },
  {
    "id": "doc-79",
    "section": "25. Art Direction",
    "label": "079",
    "title": "25. Art Direction",
    "kicker": "Documentation section",
    "summary": "Reference notes for 25. Art Direction.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-80",
    "section": "25. Art Direction",
    "label": "080",
    "title": "25.1 Characters",
    "kicker": "Section notes",
    "summary": "Face style",
    "body": [
      "Face style",
      "Body proportions",
      "Clothing",
      "Hair",
      "Materials",
      "Aging",
      "Injuries"
    ],
    "tags": [
      "25. Art Direction"
    ]
  },
  {
    "id": "doc-81",
    "section": "25. Art Direction",
    "label": "081",
    "title": "25.2 Environments",
    "kicker": "Section notes",
    "summary": "Architecture",
    "body": [
      "Architecture",
      "Colors",
      "Lighting",
      "Weather",
      "Time of day"
    ],
    "tags": [
      "25. Art Direction"
    ]
  },
  {
    "id": "doc-82",
    "section": "25. Art Direction",
    "label": "082",
    "title": "25.3 Props",
    "kicker": "Section notes",
    "summary": "Important story props",
    "body": [
      "Important story props",
      "Generic props",
      "Interactive props"
    ],
    "tags": [
      "25. Art Direction"
    ]
  },
  {
    "id": "doc-83",
    "section": "25. Art Direction",
    "label": "083",
    "title": "25.4 VFX",
    "kicker": "Section notes",
    "summary": "Blood",
    "body": [
      "Blood",
      "Fire",
      "Rain",
      "Fog",
      "Dust",
      "Particles",
      "Environmental effects"
    ],
    "tags": [
      "25. Art Direction"
    ]
  },
  {
    "id": "doc-84",
    "section": "26. Environment Documentation",
    "label": "084",
    "title": "26. Environment Documentation",
    "kicker": "Documentation section",
    "summary": "Reference notes for 26. Environment Documentation.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-85",
    "section": "26. Environment Documentation",
    "label": "085",
    "title": "26.1 Location Template",
    "kicker": "Section notes",
    "summary": "Location name",
    "body": [
      "Location name",
      "Purpose",
      "Layout",
      "Rooms",
      "Entrances/exits",
      "Important objects",
      "Interactive objects",
      "Characters present",
      "Story events",
      "Possible branches",
      "Required assets",
      "Lighting",
      "Time of day",
      "Weather",
      "Reference images / blockouts"
    ],
    "tags": [
      "26. Environment Documentation"
    ]
  },
  {
    "id": "doc-86",
    "section": "27. Audio Design",
    "label": "086",
    "title": "27. Audio Design",
    "kicker": "Documentation section",
    "summary": "Reference notes for 27. Audio Design.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-87",
    "section": "27. Audio Design",
    "label": "087",
    "title": "27.1 Music",
    "kicker": "Section notes",
    "summary": "Main theme",
    "body": [
      "Main theme",
      "Character themes",
      "Location themes",
      "Tension",
      "Horror",
      "Emotional scenes",
      "Endings"
    ],
    "tags": [
      "27. Audio Design"
    ]
  },
  {
    "id": "doc-88",
    "section": "27. Audio Design",
    "label": "088",
    "title": "27.2 SFX",
    "kicker": "Section notes",
    "summary": "Footsteps",
    "body": [
      "Footsteps",
      "Doors",
      "Environment",
      "Objects",
      "UI",
      "Vehicles",
      "Weather",
      "Combat"
    ],
    "tags": [
      "27. Audio Design"
    ]
  },
  {
    "id": "doc-89",
    "section": "27. Audio Design",
    "label": "089",
    "title": "27.3 Voice",
    "kicker": "Section notes",
    "summary": "Character voice",
    "body": [
      "Character voice",
      "Accent",
      "Acting direction",
      "Recording requirements",
      "Voice file naming"
    ],
    "tags": [
      "27. Audio Design"
    ]
  },
  {
    "id": "doc-90",
    "section": "28. Cinematics",
    "label": "090",
    "title": "28. Cinematics",
    "kicker": "Documentation section",
    "summary": "Reference notes for 28. Cinematics.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-91",
    "section": "28. Cinematics",
    "label": "091",
    "title": "28.1 Cinematic Requirements",
    "kicker": "Section notes",
    "summary": "Cutscenes",
    "body": [
      "Cutscenes",
      "In-engine cinematics",
      "Camera shots",
      "Character blocking",
      "Animation",
      "Dialogue",
      "Lighting",
      "Music",
      "SFX",
      "Transitions"
    ],
    "tags": [
      "28. Cinematics"
    ]
  },
  {
    "id": "doc-92",
    "section": "28. Cinematics",
    "label": "092",
    "title": "28.2 Shot Specification",
    "kicker": "Section notes",
    "summary": "Shot number",
    "body": [
      "Shot number",
      "Camera",
      "Character",
      "Animation",
      "Dialogue",
      "Audio",
      "Duration",
      "Transition"
    ],
    "tags": [
      "28. Cinematics"
    ]
  },
  {
    "id": "doc-93",
    "section": "29. Technical Architecture",
    "label": "093",
    "title": "29. Technical Architecture",
    "kicker": "Documentation section",
    "summary": "Reference notes for 29. Technical Architecture.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-94",
    "section": "29. Technical Architecture",
    "label": "094",
    "title": "29.1 Project Configuration",
    "kicker": "Section notes",
    "summary": "Unity version",
    "body": [
      "Unity version",
      "Render pipeline",
      "Target platforms",
      "Resolution",
      "Performance target",
      "Project structure",
      "Scene structure",
      "Prefab structure",
      "Script architecture",
      "Naming conventions",
      "Assembly definitions",
      "Packages",
      "Third-party assets"
    ],
    "tags": [
      "29. Technical Architecture"
    ]
  },
  {
    "id": "doc-95",
    "section": "29. Technical Architecture",
    "label": "095",
    "title": "29.2 Core Systems",
    "kicker": "Section notes",
    "summary": "GameManager",
    "body": [
      "GameManager",
      "SaveManager",
      "SceneManager",
      "DialogueManager",
      "ChoiceManager",
      "NarrativeManager",
      "AudioManager",
      "UIManager",
      "InventoryManager",
      "CharacterManager",
      "CutsceneManager"
    ],
    "tags": [
      "29. Technical Architecture"
    ]
  },
  {
    "id": "doc-96",
    "section": "30. Unity Architecture",
    "label": "096",
    "title": "30. Unity Architecture",
    "kicker": "Documentation section",
    "summary": "Reference notes for 30. Unity Architecture.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-97",
    "section": "30. Unity Architecture",
    "label": "097",
    "title": "30.1 Architecture Decisions",
    "kicker": "Section notes",
    "summary": "Events",
    "body": [
      "Events",
      "Interfaces",
      "ScriptableObjects",
      "Singleton usage",
      "Dependency management",
      "Scene communication",
      "Persistent objects",
      "Service/system ownership"
    ],
    "tags": [
      "30. Unity Architecture"
    ]
  },
  {
    "id": "doc-98",
    "section": "30. Unity Architecture",
    "label": "098",
    "title": "30.2 Coding Standards",
    "kicker": "Section notes",
    "summary": "Naming conventions",
    "body": [
      "Naming conventions",
      "Folder conventions",
      "Comments",
      "Error handling",
      "Logging",
      "Reusable components",
      "Performance rules"
    ],
    "tags": [
      "30. Unity Architecture"
    ]
  },
  {
    "id": "doc-99",
    "section": "31. Data Architecture",
    "label": "099",
    "title": "31. Data Architecture",
    "kicker": "Documentation section",
    "summary": "Reference notes for 31. Data Architecture.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-100",
    "section": "31. Data Architecture",
    "label": "100",
    "title": "31.1 Narrative Data",
    "kicker": "Section notes",
    "summary": "Characters",
    "body": [
      "Characters",
      "Scenes",
      "Dialogue",
      "Choices",
      "Variables",
      "Relationships",
      "Items",
      "Locations",
      "Endings"
    ],
    "tags": [
      "31. Data Architecture"
    ]
  },
  {
    "id": "doc-101",
    "section": "31. Data Architecture",
    "label": "101",
    "title": "31.2 Storage Format",
    "kicker": "Section notes",
    "summary": "ScriptableObjects",
    "body": [
      "ScriptableObjects",
      "JSON",
      "XML",
      "CSV",
      "Unity assets",
      "Custom editor tools"
    ],
    "tags": [
      "31. Data Architecture"
    ]
  },
  {
    "id": "doc-102",
    "section": "32. Save / Data Architecture",
    "label": "102",
    "title": "32. Save / Data Architecture",
    "kicker": "Documentation section",
    "summary": "Reference notes for 32. Save / Data Architecture.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-103",
    "section": "32. Save / Data Architecture",
    "label": "103",
    "title": "32.1 Save Structure",
    "kicker": "Section notes",
    "summary": "Story state",
    "body": [
      "Story state",
      "Character states",
      "Relationships",
      "Inventory",
      "Choices",
      "World state",
      "Current chapter",
      "Settings"
    ],
    "tags": [
      "32. Save / Data Architecture"
    ]
  },
  {
    "id": "doc-104",
    "section": "33. Performance Requirements",
    "label": "104",
    "title": "33. Performance Requirements",
    "kicker": "Documentation section",
    "summary": "Reference notes for 33. Performance Requirements.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-105",
    "section": "33. Performance Requirements",
    "label": "105",
    "title": "33.1 Targets",
    "kicker": "Section notes",
    "summary": "Target FPS",
    "body": [
      "Target FPS",
      "Target resolution",
      "Minimum hardware",
      "Maximum loading time",
      "Memory target",
      "Scene size",
      "Texture limits",
      "Draw calls",
      "CPU budget",
      "GPU budget"
    ],
    "tags": [
      "33. Performance Requirements"
    ]
  },
  {
    "id": "doc-106",
    "section": "34. Platform Requirements",
    "label": "106",
    "title": "34. Platform Requirements",
    "kicker": "Documentation section",
    "summary": "Reference notes for 34. Platform Requirements.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-107",
    "section": "34. Platform Requirements",
    "label": "107",
    "title": "34.1 PC",
    "kicker": "Section notes",
    "summary": "Windows versions",
    "body": [
      "Windows versions",
      "Keyboard/mouse",
      "Controller",
      "Ultrawide",
      "Resolution support",
      "Graphics settings"
    ],
    "tags": [
      "34. Platform Requirements"
    ]
  },
  {
    "id": "doc-108",
    "section": "34. Platform Requirements",
    "label": "108",
    "title": "34.2 Other Platforms",
    "kicker": "Section notes",
    "summary": "Platform-specific requirements",
    "body": [
      "Platform-specific requirements",
      "Input",
      "Performance",
      "Certification requirements"
    ],
    "tags": [
      "34. Platform Requirements"
    ]
  },
  {
    "id": "doc-109",
    "section": "35. Localization",
    "label": "109",
    "title": "35. Localization",
    "kicker": "Documentation section",
    "summary": "Reference notes for 35. Localization.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-110",
    "section": "35. Localization",
    "label": "110",
    "title": "35.1 Localization Plan",
    "kicker": "Section notes",
    "summary": "Supported languages",
    "body": [
      "Supported languages",
      "Text extraction",
      "Translation workflow",
      "Font requirements",
      "Text expansion",
      "Subtitles",
      "Voice localization",
      "UI localization",
      "Cultural adaptation"
    ],
    "tags": [
      "35. Localization"
    ]
  },
  {
    "id": "doc-111",
    "section": "36. Tools / Editor Tools",
    "label": "111",
    "title": "36. Tools / Editor Tools",
    "kicker": "Documentation section",
    "summary": "Reference notes for 36. Tools / Editor Tools.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-112",
    "section": "36. Tools / Editor Tools",
    "label": "112",
    "title": "36.1 Development Tools",
    "kicker": "Section notes",
    "summary": "Dialogue editor",
    "body": [
      "Dialogue editor",
      "Choice editor",
      "Story flow editor",
      "Character relationship editor",
      "Variable/state inspector",
      "Scene database",
      "Character database",
      "Ending tracker",
      "Localization exporter",
      "Dialogue CSV importer/exporter",
      "Narrative debugger"
    ],
    "tags": [
      "36. Tools / Editor Tools"
    ]
  },
  {
    "id": "doc-113",
    "section": "37. Debugging Tools",
    "label": "113",
    "title": "37. Debugging Tools",
    "kicker": "Documentation section",
    "summary": "Reference notes for 37. Debugging Tools.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-114",
    "section": "37. Debugging Tools",
    "label": "114",
    "title": "37.1 Narrative Debugger",
    "kicker": "Section notes",
    "summary": "Current story state",
    "body": [
      "Current story state",
      "Character alive/dead states",
      "Relationship values",
      "Story variables",
      "Current chapter",
      "Set variables",
      "Teleport to scenes",
      "Skip dialogue",
      "Trigger choices",
      "Force character deaths",
      "Test endings",
      "Replay branches"
    ],
    "tags": [
      "37. Debugging Tools"
    ]
  },
  {
    "id": "doc-115",
    "section": "38. Testing / QA",
    "label": "115",
    "title": "38. Testing / QA",
    "kicker": "Documentation section",
    "summary": "Reference notes for 38. Testing / QA.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-116",
    "section": "38. Testing / QA",
    "label": "116",
    "title": "38.1 Testing Types",
    "kicker": "Section notes",
    "summary": "Functional testing",
    "body": [
      "Functional testing",
      "Narrative testing",
      "State testing",
      "Save testing",
      "Regression testing",
      "Performance testing",
      "Localization testing",
      "Controller testing",
      "Accessibility testing"
    ],
    "tags": [
      "38. Testing / QA"
    ]
  },
  {
    "id": "doc-117",
    "section": "38. Testing / QA",
    "label": "117",
    "title": "38.2 Branch Coverage",
    "kicker": "Section notes",
    "summary": "Total major choices",
    "body": [
      "Total major choices",
      "Tested branches",
      "Untested branches",
      "Ending coverage",
      "Critical path coverage"
    ],
    "tags": [
      "38. Testing / QA"
    ]
  },
  {
    "id": "doc-118",
    "section": "39. Asset List",
    "label": "118",
    "title": "39. Asset List",
    "kicker": "Documentation section",
    "summary": "Reference notes for 39. Asset List.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-119",
    "section": "39. Asset List",
    "label": "119",
    "title": "39.1 Asset Categories",
    "kicker": "Section notes",
    "summary": "Characters",
    "body": [
      "Characters",
      "Character models",
      "Hair",
      "Clothing",
      "Facial animations",
      "Animations",
      "Voice",
      "Environment",
      "Buildings",
      "Rooms",
      "Props",
      "Vehicles",
      "Audio",
      "Music",
      "SFX",
      "VFX"
    ],
    "tags": [
      "39. Asset List"
    ]
  },
  {
    "id": "doc-120",
    "section": "39. Asset List",
    "label": "120",
    "title": "39.2 Asset Metadata",
    "kicker": "Section notes",
    "summary": "Asset ID",
    "body": [
      "Asset ID",
      "Name",
      "Type",
      "Priority",
      "Status",
      "Required by",
      "Owner",
      "Source",
      "License"
    ],
    "tags": [
      "39. Asset List"
    ]
  },
  {
    "id": "doc-121",
    "section": "40. Development Roadmap",
    "label": "121",
    "title": "40. Development Roadmap",
    "kicker": "Documentation section",
    "summary": "Reference notes for 40. Development Roadmap.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-122",
    "section": "40. Development Roadmap",
    "label": "122",
    "title": "40.1 Phases",
    "kicker": "Section notes",
    "summary": "Pre-production",
    "body": [
      "Pre-production",
      "Vertical Slice",
      "Production",
      "Alpha",
      "Beta",
      "Release Candidate",
      "Launch",
      "Post-launch"
    ],
    "tags": [
      "40. Development Roadmap"
    ]
  },
  {
    "id": "doc-123",
    "section": "40. Development Roadmap",
    "label": "123",
    "title": "40.2 Milestones",
    "kicker": "Section notes",
    "summary": "Narrative prototype",
    "body": [
      "Narrative prototype",
      "Vertical slice",
      "Systems complete",
      "Content complete",
      "Alpha",
      "Beta",
      "Release candidate",
      "Launch"
    ],
    "tags": [
      "40. Development Roadmap"
    ]
  },
  {
    "id": "doc-124",
    "section": "41. Task Management",
    "label": "124",
    "title": "41. Task Management",
    "kicker": "Documentation section",
    "summary": "Reference notes for 41. Task Management.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-125",
    "section": "41. Task Management",
    "label": "125",
    "title": "41.1 Task Fields",
    "kicker": "Section notes",
    "summary": "Task",
    "body": [
      "Task",
      "Description",
      "Priority",
      "Dependencies",
      "Status",
      "Estimate",
      "Actual time",
      "Notes"
    ],
    "tags": [
      "41. Task Management"
    ]
  },
  {
    "id": "doc-126",
    "section": "41. Task Management",
    "label": "126",
    "title": "41.2 Statuses",
    "kicker": "Section notes",
    "summary": "Not Started",
    "body": [
      "Not Started",
      "Planning",
      "In Progress",
      "Blocked",
      "Testing",
      "Complete"
    ],
    "tags": [
      "41. Task Management"
    ]
  },
  {
    "id": "doc-127",
    "section": "42. Risk Management",
    "label": "127",
    "title": "42. Risk Management",
    "kicker": "Documentation section",
    "summary": "Reference notes for 42. Risk Management.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-128",
    "section": "42. Risk Management",
    "label": "128",
    "title": "42.1 Risks",
    "kicker": "Section notes",
    "summary": "Story becomes too large",
    "body": [
      "Story becomes too large",
      "Too many characters",
      "Too many branches",
      "Asset workload",
      "Voice acting workload",
      "Animation workload",
      "Performance",
      "Save system complexity",
      "Branch bugs",
      "Scope creep"
    ],
    "tags": [
      "42. Risk Management"
    ]
  },
  {
    "id": "doc-129",
    "section": "42. Risk Management",
    "label": "129",
    "title": "42.2 Risk Fields",
    "kicker": "Section notes",
    "summary": "Risk",
    "body": [
      "Risk",
      "Probability",
      "Impact",
      "Mitigation"
    ],
    "tags": [
      "42. Risk Management"
    ]
  },
  {
    "id": "doc-130",
    "section": "43. Scope Management",
    "label": "130",
    "title": "43. Scope Management",
    "kicker": "Documentation section",
    "summary": "Reference notes for 43. Scope Management.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-131",
    "section": "43. Scope Management",
    "label": "131",
    "title": "43.1 What I Am NOT Making",
    "kicker": "Section notes",
    "summary": "Explicitly list systems, features, genres, platforms, and content that are outside the project's scope.",
    "body": [
      "Explicitly list systems, features, genres, platforms, and content that are outside the project's scope."
    ],
    "tags": [
      "43. Scope Management"
    ]
  },
  {
    "id": "doc-132",
    "section": "43. Scope Management",
    "label": "132",
    "title": "43.2 Scope Rules",
    "kicker": "Section notes",
    "summary": "Define what qualifies as a feature addition.",
    "body": [
      "Define what qualifies as a feature addition.",
      "Define who/what can approve scope changes.",
      "Document the reason for major scope changes."
    ],
    "tags": [
      "43. Scope Management"
    ]
  },
  {
    "id": "doc-133",
    "section": "44. Budget",
    "label": "133",
    "title": "44. Budget",
    "kicker": "Documentation section",
    "summary": "Reference notes for 44. Budget.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-134",
    "section": "44. Budget",
    "label": "134",
    "title": "44.1 Costs",
    "kicker": "Section notes",
    "summary": "Software",
    "body": [
      "Software",
      "Assets",
      "Plugins",
      "Music",
      "Sound effects",
      "Voice acting",
      "Motion capture",
      "Freelancers",
      "Marketing",
      "Store fees",
      "Localization",
      "Legal",
      "Hardware",
      "Hosting"
    ],
    "tags": [
      "44. Budget"
    ]
  },
  {
    "id": "doc-135",
    "section": "45. Legal / Licensing",
    "label": "135",
    "title": "45. Legal / Licensing",
    "kicker": "Documentation section",
    "summary": "Reference notes for 45. Legal / Licensing.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-136",
    "section": "45. Legal / Licensing",
    "label": "136",
    "title": "45.1 Licensing Checklist",
    "kicker": "Section notes",
    "summary": "Unity license",
    "body": [
      "Unity license",
      "Asset licenses",
      "Music licenses",
      "SFX licenses",
      "Font licenses",
      "Character/model licenses",
      "AI-generated content licenses",
      "Voice licenses",
      "Third-party plugins",
      "Trademark considerations",
      "Copyright ownership"
    ],
    "tags": [
      "45. Legal / Licensing"
    ]
  },
  {
    "id": "doc-137",
    "section": "46. Marketing",
    "label": "137",
    "title": "46. Marketing",
    "kicker": "Documentation section",
    "summary": "Reference notes for 46. Marketing.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-138",
    "section": "46. Marketing",
    "label": "138",
    "title": "46.1 Game Identity",
    "kicker": "Section notes",
    "summary": "Logo",
    "body": [
      "Logo",
      "Key art",
      "Tagline",
      "Elevator pitch"
    ],
    "tags": [
      "46. Marketing"
    ]
  },
  {
    "id": "doc-139",
    "section": "46. Marketing",
    "label": "139",
    "title": "46.2 Marketing Materials",
    "kicker": "Section notes",
    "summary": "Screenshots",
    "body": [
      "Screenshots",
      "Trailer",
      "Teaser",
      "Gameplay trailer",
      "GIFs",
      "Press kit"
    ],
    "tags": [
      "46. Marketing"
    ]
  },
  {
    "id": "doc-140",
    "section": "46. Marketing",
    "label": "140",
    "title": "46.3 Store Page",
    "kicker": "Section notes",
    "summary": "Description",
    "body": [
      "Description",
      "Features",
      "Screenshots",
      "Trailer",
      "System requirements",
      "Tags",
      "Age rating"
    ],
    "tags": [
      "46. Marketing"
    ]
  },
  {
    "id": "doc-141",
    "section": "47. Release",
    "label": "141",
    "title": "47. Release",
    "kicker": "Documentation section",
    "summary": "Reference notes for 47. Release.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-142",
    "section": "47. Release",
    "label": "142",
    "title": "47.1 Distribution",
    "kicker": "Section notes",
    "summary": "Steam",
    "body": [
      "Steam",
      "Epic",
      "itch.io",
      "PlayStation",
      "Xbox",
      "Other platforms"
    ],
    "tags": [
      "47. Release"
    ]
  },
  {
    "id": "doc-143",
    "section": "47. Release",
    "label": "143",
    "title": "47.2 Release Checklist",
    "kicker": "Section notes",
    "summary": "Build",
    "body": [
      "Build",
      "QA",
      "Achievements",
      "Save system",
      "Localization",
      "Store page",
      "Trailer",
      "Marketing",
      "Pricing",
      "System requirements",
      "Crash reporting",
      "Analytics"
    ],
    "tags": [
      "47. Release"
    ]
  },
  {
    "id": "doc-144",
    "section": "48. Post-Launch",
    "label": "144",
    "title": "48. Post-Launch",
    "kicker": "Documentation section",
    "summary": "Reference notes for 48. Post-Launch.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-145",
    "section": "48. Post-Launch",
    "label": "145",
    "title": "48.1 Post-Launch Plan",
    "kicker": "Section notes",
    "summary": "Bug fixes",
    "body": [
      "Bug fixes",
      "Patches",
      "Player feedback",
      "Analytics",
      "Performance issues",
      "Localization updates",
      "DLC",
      "Additional endings",
      "New content",
      "Community management"
    ],
    "tags": [
      "48. Post-Launch"
    ]
  },
  {
    "id": "doc-146",
    "section": "49. Version Control",
    "label": "146",
    "title": "49. Version Control",
    "kicker": "Documentation section",
    "summary": "Reference notes for 49. Version Control.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-147",
    "section": "49. Version Control",
    "label": "147",
    "title": "49.1 Repository",
    "kicker": "Section notes",
    "summary": "Git repository",
    "body": [
      "Git repository",
      "Git LFS",
      "Backup strategy",
      "Branch strategy",
      "Release branches"
    ],
    "tags": [
      "49. Version Control"
    ]
  },
  {
    "id": "doc-148",
    "section": "49. Version Control",
    "label": "148",
    "title": "49.2 Versioning",
    "kicker": "Section notes",
    "summary": "Commit naming",
    "body": [
      "Commit naming",
      "Version numbering",
      "Release tags",
      "Changelog"
    ],
    "tags": [
      "49. Version Control"
    ]
  },
  {
    "id": "doc-149",
    "section": "50. Project Folder Structure",
    "label": "149",
    "title": "50. Project Folder Structure",
    "kicker": "Documentation section",
    "summary": "Reference notes for 50. Project Folder Structure.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-150",
    "section": "50. Project Folder Structure",
    "label": "150",
    "title": "50.1 Suggested Unity Structure",
    "kicker": "Section notes",
    "summary": "Assets/Art",
    "body": [
      "Assets/Art",
      "Assets/Audio",
      "Assets/Characters",
      "Assets/Environments",
      "Assets/Materials",
      "Assets/Animations",
      "Assets/Prefabs",
      "Assets/Scenes",
      "Assets/Scripts/Core",
      "Assets/Scripts/Player",
      "Assets/Scripts/Narrative",
      "Assets/Scripts/Dialogue",
      "Assets/Scripts/AI",
      "Assets/Scripts/UI",
      "Assets/Scripts/Save",
      "Assets/ScriptableObjects",
      "Assets/UI",
      "Assets/Resources"
    ],
    "tags": [
      "50. Project Folder Structure"
    ]
  },
  {
    "id": "doc-151",
    "section": "51. Naming Conventions",
    "label": "151",
    "title": "51. Naming Conventions",
    "kicker": "Documentation section",
    "summary": "Reference notes for 51. Naming Conventions.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-152",
    "section": "51. Naming Conventions",
    "label": "152",
    "title": "51.1 Asset Naming",
    "kicker": "Section notes",
    "summary": "SCN_Chapter01_Forest",
    "body": [
      "SCN_Chapter01_Forest",
      "CHR_Sarah",
      "ENV_ForestCabin",
      "PROP_Key",
      "ANM_Sarah_Walk",
      "SFX_Door_Open",
      "MUS_Tension_01",
      "UI_DialogueBox"
    ],
    "tags": [
      "51. Naming Conventions"
    ]
  },
  {
    "id": "doc-153",
    "section": "51. Naming Conventions",
    "label": "153",
    "title": "51.2 Code Naming",
    "kicker": "Section notes",
    "summary": "DialogueManager",
    "body": [
      "DialogueManager",
      "ChoiceManager",
      "SaveManager",
      "CharacterController"
    ],
    "tags": [
      "51. Naming Conventions"
    ]
  },
  {
    "id": "doc-154",
    "section": "52. Documentation Change Log",
    "label": "154",
    "title": "52. Documentation Change Log",
    "kicker": "Documentation section",
    "summary": "Reference notes for 52. Documentation Change Log.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-155",
    "section": "52. Documentation Change Log",
    "label": "155",
    "title": "52.1 Change Log Fields",
    "kicker": "Section notes",
    "summary": "Version",
    "body": [
      "Version",
      "Date",
      "Change",
      "Reason",
      "Impact",
      "Author"
    ],
    "tags": [
      "52. Documentation Change Log"
    ]
  },
  {
    "id": "doc-156",
    "section": "53. Glossary",
    "label": "156",
    "title": "53. Glossary",
    "kicker": "Documentation section",
    "summary": "Reference notes for 53. Glossary.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-157",
    "section": "53. Glossary",
    "label": "157",
    "title": "53.1 Terms",
    "kicker": "Section notes",
    "summary": "Branch",
    "body": [
      "Branch",
      "Node",
      "State",
      "Flag",
      "Choice",
      "Consequence",
      "Scene",
      "Chapter",
      "Arc",
      "Ending",
      "Relationship",
      "Trigger",
      "Condition"
    ],
    "tags": [
      "53. Glossary"
    ]
  },
  {
    "id": "doc-158",
    "section": "54. Master Story Map",
    "label": "158",
    "title": "54. Master Story Map",
    "kicker": "Documentation section",
    "summary": "Reference notes for 54. Master Story Map.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-159",
    "section": "54. Master Story Map",
    "label": "159",
    "title": "54.1 Story Map",
    "kicker": "Section notes",
    "summary": "Create one master visual map representing the entire game: chapters, choices, branches, convergence points, character fates, and endings.",
    "body": [
      "Create one master visual map representing the entire game: chapters, choices, branches, convergence points, character fates, and endings."
    ],
    "tags": [
      "54. Master Story Map"
    ]
  },
  {
    "id": "doc-160",
    "section": "55. Definition of Done",
    "label": "160",
    "title": "55. Definition of Done",
    "kicker": "Documentation section",
    "summary": "Reference notes for 55. Definition of Done.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-161",
    "section": "55. Definition of Done",
    "label": "161",
    "title": "55.1 Feature Completion",
    "kicker": "Section notes",
    "summary": "Define what 'done' means for each major system.",
    "body": [
      "Define what 'done' means for each major system.",
      "Example â€” Dialogue system: dialogue displays; multiple speakers work; choices work; conditions work; variables update; save/load works; localization works; voice can be attached; skip works; controller works; no known critical bugs."
    ],
    "tags": [
      "55. Definition of Done"
    ]
  },
  {
    "id": "doc-162",
    "section": "56. Vertical Slice Specification",
    "label": "162",
    "title": "56. Vertical Slice Specification",
    "kicker": "Documentation section",
    "summary": "Reference notes for 56. Vertical Slice Specification.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-163",
    "section": "56. Vertical Slice Specification",
    "label": "163",
    "title": "56.1 Vertical Slice",
    "kicker": "Section notes",
    "summary": "Final-quality character",
    "body": [
      "Final-quality character",
      "Final-quality environment",
      "Dialogue",
      "Choice",
      "Branch",
      "Relationship change",
      "Animation",
      "Cinematic",
      "Audio",
      "Save/load",
      "UI",
      "One meaningful consequence"
    ],
    "tags": [
      "56. Vertical Slice Specification"
    ]
  },
  {
    "id": "doc-164",
    "section": "56. Vertical Slice Specification",
    "label": "164",
    "title": "56.2 Vertical Slice Goal",
    "kicker": "Section notes",
    "summary": "Prove that a representative section of the actual game is technically and creatively achievable before committing to full production.",
    "body": [
      "Prove that a representative section of the actual game is technically and creatively achievable before committing to full production."
    ],
    "tags": [
      "56. Vertical Slice Specification"
    ]
  },
  {
    "id": "doc-165",
    "section": "57. Master Databases",
    "label": "165",
    "title": "57. Master Databases",
    "kicker": "Documentation section",
    "summary": "Reference notes for 57. Master Databases.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-166",
    "section": "57. Master Databases",
    "label": "166",
    "title": "57.1 Character Database",
    "kicker": "Section notes",
    "summary": "Reference notes for 57.1 Character Database.",
    "body": [],
    "tags": [
      "57. Master Databases"
    ]
  },
  {
    "id": "doc-167",
    "section": "57. Master Databases",
    "label": "167",
    "title": "57.2 Scene Database",
    "kicker": "Section notes",
    "summary": "Reference notes for 57.2 Scene Database.",
    "body": [],
    "tags": [
      "57. Master Databases"
    ]
  },
  {
    "id": "doc-168",
    "section": "57. Master Databases",
    "label": "168",
    "title": "57.3 Choice Database",
    "kicker": "Section notes",
    "summary": "Reference notes for 57.3 Choice Database.",
    "body": [],
    "tags": [
      "57. Master Databases"
    ]
  },
  {
    "id": "doc-169",
    "section": "57. Master Databases",
    "label": "169",
    "title": "57.4 Variable Database",
    "kicker": "Section notes",
    "summary": "Reference notes for 57.4 Variable Database.",
    "body": [],
    "tags": [
      "57. Master Databases"
    ]
  },
  {
    "id": "doc-170",
    "section": "57. Master Databases",
    "label": "170",
    "title": "57.5 Asset Database",
    "kicker": "Section notes",
    "summary": "Reference notes for 57.5 Asset Database.",
    "body": [],
    "tags": [
      "57. Master Databases"
    ]
  },
  {
    "id": "doc-171",
    "section": "57. Master Databases",
    "label": "171",
    "title": "57.6 Ending Database",
    "kicker": "Section notes",
    "summary": "Reference notes for 57.6 Ending Database.",
    "body": [],
    "tags": [
      "57. Master Databases"
    ]
  },
  {
    "id": "doc-172",
    "section": "57. Master Databases",
    "label": "172",
    "title": "57.7 Dialogue Database",
    "kicker": "Section notes",
    "summary": "Reference notes for 57.7 Dialogue Database.",
    "body": [],
    "tags": [
      "57. Master Databases"
    ]
  },
  {
    "id": "doc-173",
    "section": "58. Final Master Checklist",
    "label": "173",
    "title": "58. Final Master Checklist",
    "kicker": "Documentation section",
    "summary": "Reference notes for 58. Final Master Checklist.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-174",
    "section": "58. Final Master Checklist",
    "label": "174",
    "title": "58.1 Documentation Areas",
    "kicker": "Section notes",
    "summary": "Game Overview",
    "body": [
      "Game Overview",
      "Vision & Design Pillars",
      "Story Bible",
      "World",
      "Timeline",
      "Characters",
      "Relationships",
      "Story",
      "Chapters",
      "Scenes",
      "Choices",
      "Branches",
      "Endings",
      "Gameplay",
      "Game Systems",
      "UI/UX",
      "Accessibility",
      "Art",
      "Animation",
      "Cinematics",
      "Audio",
      "Technical Architecture",
      "Tools",
      "Debugging",
      "Assets",
      "Testing",
      "Branch Coverage",
      "Production Roadmap",
      "Milestones",
      "Tasks",
      "Risks",
      "Scope",
      "Budget",
      "Legal",
      "Marketing",
      "Release",
      "Post-Launch"
    ],
    "tags": [
      "58. Final Master Checklist"
    ]
  },
  {
    "id": "doc-175",
    "section": "59. Priority for Starting the Project",
    "label": "175",
    "title": "59. Priority for Starting the Project",
    "kicker": "Documentation section",
    "summary": "Reference notes for 59. Priority for Starting the Project.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-176",
    "section": "59. Priority for Starting the Project",
    "label": "176",
    "title": "59.1 Recommended Order",
    "kicker": "Section notes",
    "summary": "Game concept",
    "body": [
      "Game concept",
      "Story",
      "Characters",
      "World",
      "Story timeline",
      "Branching structure",
      "Chapters/scenes",
      "Core gameplay",
      "Technical architecture",
      "Vertical slice",
      "Production plan",
      "Remaining documentation"
    ],
    "tags": [
      "59. Priority for Starting the Project"
    ]
  },
  {
    "id": "doc-177",
    "section": "59. Priority for Starting the Project",
    "label": "177",
    "title": "59.2 Early Priorities",
    "kicker": "Section notes",
    "summary": "Character state",
    "body": [
      "Character state",
      "Story state",
      "Branch/consequence mapping",
      "Narrative data structure",
      "Save/load strategy",
      "Vertical slice"
    ],
    "tags": [
      "59. Priority for Starting the Project"
    ]
  },
  {
    "id": "doc-178",
    "section": "Appendix A â€” Master Tables",
    "label": "178",
    "title": "Appendix A â€” Master Tables",
    "kicker": "Documentation section",
    "summary": "Reference notes for Appendix A â€” Master Tables.",
    "body": [],
    "tags": [
      "Requirements"
    ]
  },
  {
    "id": "doc-179",
    "section": "Appendix A â€” Master Tables",
    "label": "179",
    "title": "Character Master Table",
    "kicker": "Section notes",
    "summary": "Reference notes for Character Master Table.",
    "body": [],
    "tags": [
      "Appendix A â€” Master Tables"
    ]
  },
  {
    "id": "doc-180",
    "section": "Appendix A â€” Master Tables",
    "label": "180",
    "title": "Scene Master Table",
    "kicker": "Section notes",
    "summary": "Reference notes for Scene Master Table.",
    "body": [],
    "tags": [
      "Appendix A â€” Master Tables"
    ]
  },
  {
    "id": "doc-181",
    "section": "Appendix A â€” Master Tables",
    "label": "181",
    "title": "Choice Master Table",
    "kicker": "Section notes",
    "summary": "Reference notes for Choice Master Table.",
    "body": [],
    "tags": [
      "Appendix A â€” Master Tables"
    ]
  },
  {
    "id": "doc-182",
    "section": "Appendix A â€” Master Tables",
    "label": "182",
    "title": "Variable Master Table",
    "kicker": "Section notes",
    "summary": "Reference notes for Variable Master Table.",
    "body": [],
    "tags": [
      "Appendix A â€” Master Tables"
    ]
  },
  {
    "id": "doc-183",
    "section": "Appendix A â€” Master Tables",
    "label": "183",
    "title": "Asset Master Table",
    "kicker": "Section notes",
    "summary": "Reference notes for Asset Master Table.",
    "body": [],
    "tags": [
      "Appendix A â€” Master Tables"
    ]
  },
  {
    "id": "doc-184",
    "section": "Appendix A â€” Master Tables",
    "label": "184",
    "title": "Ending Master Table",
    "kicker": "Section notes",
    "summary": "Reference notes for Ending Master Table.",
    "body": [],
    "tags": [
      "Appendix A â€” Master Tables"
    ]
  },
  {
    "id": "doc-185",
    "section": "Appendix A â€” Master Tables",
    "label": "185",
    "title": "Dialogue Master Table",
    "kicker": "Section notes",
    "summary": "Reference notes for Dialogue Master Table.",
    "body": [],
    "tags": [
      "Appendix A â€” Master Tables"
    ]
  },
  {
    "id": "doc-186",
    "section": "Appendix B â€” Project Notes",
    "label": "186",
    "title": "Appendix B â€” Project Notes",
    "kicker": "Documentation section",
    "summary": "Use this area for miscellaneous ideas, references, unresolved questions, research, and decisions that have not yet been assigned to a specific section.",
    "body": [
      "Use this area for miscellaneous ideas, references, unresolved questions, research, and decisions that have not yet been assigned to a specific section."
    ],
    "tags": [
      "Requirements"
    ]
  }
]

