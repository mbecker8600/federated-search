### Use case 1
   Query
   ```
   query {
          logset(log_set_id: 50) {
              name
              logset_items {
                  log {
                     log_guid 
                     log_kind
                     start_time
                     log_category
                  }
              }
          }
      }
   ```
   Results
   ```
   {
       "data": {
           "logset": {
               "name": "Nina574",
               "logset_items": [
                   {
                       "log": {
                           "log_guid": "6BA39820-091C-48BD-361D-01106E7F9B03",
                           "log_kind": "rna",
                           "start_time": "1555908329130",
                           "log_category": "Maps"
                       }
                   },
                   {
                       "log": {
                           "log_guid": "6BA39820-091C-48BD-361D-01106E7F9B03",
                           "log_kind": "rna",
                           "start_time": "1555908329130",
                           "log_category": "Maps"
                       }
                   }
               ]
           }
       }
   }
   ```
### Use case 2
   Query
   ```
   query {
       logs(filter: "rna", limit: 3) {
           log_guid
           log_kind
           events {
               event_time
               event_type
               event_severity
               event_comment
           }
       }
   }
   ```
   Results
   ```
   {
       "data": {
           "logs": [
               {
                   "log_guid": "86FCB407-4EDF-C220-4B12-0002FD2BB55E",
                   "log_kind": "rna",
                   "events": [
                       {
                           "event_time": "1528046626900",
                           "event_type": "Other",
                           "event_severity": "Medium    ",
                           "event_comment": "transit. fecit, pladior non Versus in vobis non et non estis quad travissimantor fecundio, ut quad dolorum"
                       },
                       {
                           "event_time": "1538693753340",
                           "event_type": "Other",
                           "event_severity": "Medium    ",
                           "event_comment": "travissimantor esset quad fecundio, cognitio, rarendum plurissimum fecit, regit, si plorum cognitio, Multum"
                       }
                   ]
               },
               {
                   "log_guid": "4EDD5967-72E4-4699-8E80-000E626BB22D",
                   "log_kind": "rna",
                   "events": [
                       {
                           "event_time": "1546109157780",
                           "event_type": "Intervention",
                           "event_severity": "Small     ",
                           "event_comment": "linguens in quo et eggredior. quad Multum Id apparens novum et funem. plorum bono regit, quo, linguens"
                       }
                   ]
               },
               {
                   "log_guid": "756FED52-1B45-3527-7102-001572F6C018",
                   "log_kind": "rna",
                   "events": [
                       {
                           "event_time": "1532341707000",
                           "event_type": "Other",
                           "event_severity": "Medium    ",
                           "event_comment": "brevens, apparens plorum plorum quo transit. trepicandor vobis esset gravis parte bono nomen linguens plorum"
                       }
                   ]
               }
           ]
       }
   }
   ```