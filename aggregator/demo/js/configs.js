ccm.files[ 'configs.js' ] = {
  "quiz": {
    "aggregatable": ["topics", "vocabulary"],
    "topics": ["questions", "arithmetic"],
    "vocabulary": ["word1", "word2"],
    "css": [ "ccm.load", "https://ccmjs.github.io/akless-components/quiz/resources/weblysleek.css", { "context": "head", "url": "https://ccmjs.github.io/akless-components/libs/weblysleekui/font.css" } ],
    "questions": [
      {
        "text": "How many of these answers are correct?",
        "description": "Select the correct answer from the following answers.",
        "answers": [
          {
            "text": "one",
            "comment": "Because you can't choose more than one answer."
          },
          "two",
          "three"
        ],
        "input": "radio",
        "correct": 0
      },
      {
        "text": "How many answers can be correct here?",
        "description": "Pay attention to the input field type.",
        "answers": [
          "absolutely none",
          {
            "text": "maximum of one",
            "comment": "Because you can choose more than one answer."
          },
          "more than one"
        ],
        "correct": [ true, false, true ]
      },
      {
        "text": "What is the solution to the following arithmetical tasks?",
        "description": "Please enter the solutions into the input fields.",
        "answers": [
          "=&nbsp; 1 + 1",
          "=&nbsp; 1 - 1",
          "=&nbsp;-1 - 1"
        ],
        "input": "number",
        "attributes": {
          "min": -2,
          "max": 2
        },
        "correct": [ 2, 0, -2 ]
      }
    ],
    "feedback": true,
    "navigation": true,
    "placeholder.finish": "Restart",
    "onfinish": { "log": true, "restart": true }
  },
  "cloze": {
    "aggregatable": ["keywords"],
    "css": [ "ccm.load",
      "https://ccmjs.github.io/akless-components/cloze/resources/default.css",
      { "context": "head", "url": "https://fonts.googleapis.com/css?family=Montserrat:200", "type": "css" }
    ],
    "feedback": true,
    "time": 300,
    "keywords": [ "convenience", "conducting", "objectives", "durable", "competitive", "breakdown", "reasons", "evaluate", "adding", "breakthroughs", "withdraw", "patterns", "non-durable", "deleting", "feasible", "making", "sources", "niche" ],
    "text": "<ol><li>To stay competitive companies must *evaluate* their existing product line and make decisions about *deleting* or *adding* new products.</li><li>Innovation can have different *sources* e.g. “Discontinuous” innovation, which can change existing consumption *patterns*.</li><li>Innovations are of extreme importance for organizations; some innovations are caused by technical *breakthroughs*.</li><li>In order to be successful companies may need to look for a market *niche*.</li><li> It is assumed that *durable* goods last more than one year. *Non-durable*  goods are tangible but provide benefits only for a short period of time. *convenience* products are goods that consumers buy frequently like soft drinks, newspapers etc.</li><li>A business model identifies such things as *competitive* advantage, and how to become profitable. Some business models may not be *feasible* any longer.</li><li>One way to evaluate a product is by *conducting* a discrimination test.</li><li>When a product fails i.e. it does not meet the *objectives* that were set by the organization, the company may be forced to *withdraw* it from the market, as was the case with Walmart in Germany.</li></ol>",
    "blank": true,
    "retry": true,
    "captions.finish": "Save and Restart",
  },
  "slidecast": {
    "aggregatable": ["topics", "vocabulary"],
    "topics": ["photos", "pictures"],
    "vocabulary": ["word1", "word2", "word3"],
    "slides": [
      {
        "image": "https://images.unsplash.com/photo-1512766411668-e305741fcb8b?ixlib=rb-0.3.5&s=201ca0d3c8520c8624b84db55270b38d&auto=format&fit=crop&w=1050&q=80"
      },
      {
        "image": "https://images.unsplash.com/photo-1497398276231-94ff5dc90217?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f0ce3550fc40a23bb71bda77cd496273&auto=format&fit=crop&w=1050&q=80",
      }
    ]
  }
};