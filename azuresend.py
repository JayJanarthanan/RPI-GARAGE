import time
from datetime import datetime
from azure.storage.table import TableService
import temp


table_service = TableService(account_name='<AZURE_NAME_HERE', account_key='<KEY_HERE>')
table_name = 'tempData'
partition_key = 'garage'
table_service.create_table(table_name, False)

while True:
  date = datetime.now()
  iso_date = date.isoformat()    
  tempRecord = temp.read_temp()
  entry = {'PartitionKey': partition_key, 'RowKey': iso_date, 'Temperature': tempRecord}
  table_service.insert_entity(table_name, entry)
  print("SENT", tempRecord)
  time.sleep(120) # wait two minutes
