curl -vvv -X POST -H "Content-type: application/json" -d '{
    "context": {
      "channel": "web"
    },
      "execute": {
    "pageLoad": {},
        "mboxes": [
          {
            "name": "Experiment 1",
            "index": 0
          }
        ]
      }
  }' 'https://sitesinternal.tt.omtrdc.net/rest/v1/delivery?client=sitesinternal&sessionId=9'
