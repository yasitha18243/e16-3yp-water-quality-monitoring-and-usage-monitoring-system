import logging
from concurrent.futures import ThreadPoolExecutor
from grpc import server
import task_pb2, task_pb2_grpc
from ratelimit import limits, RateLimitException
from backoff import on_exception, expo
HOUR = 3600

class TaskapiImpl:

    
    def __init__(self):
        
       
        self.clientlist = task_pb2.Clients()
        pass

    @limits(calls = 10, period = HOUR * 10)
    def addClient(self, request, context):
        logging.info(f"adding client {request.noOfTanks}")
        
        length = len(self.clientlist.clients)
        newClient = task_pb2.Client(id = length, fName = request.fName, lName = request.lName, noOfTanks = request.noOfTanks)
        self.clientlist.clients.append(newClient)
        print("{} is added with {} tanks.".format(request.fName, request.noOfTanks))
        print("\n")
        return task_pb2.Id(id = length)
       

    max_time=60
    @limits(calls = 10, period = HOUR * 10)    
    def delClient(self, request, context):
        logging.info(f"deleting client {request.id}")
       

        noOfClients = len(self.clientlist.clients)   

        for i in range(noOfClients): 

            if(self.clientlist.clients[i].id == request.id):  

                print("Removed clientID: ", self.clientlist.clients[i].id)
                return self.clientlist.clients.pop(i)                
               
                
        print("Client not found!!")   
        return

    @limits(calls = 10, period = HOUR * 10)
    def listClients(self, request, context):
        logging.info("returning client list")
    
        return self.clientlist


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    with ThreadPoolExecutor(max_workers=1) as pool:
        taskserver = server(pool)
        task_pb2_grpc.add_TaskapiServicer_to_server(TaskapiImpl(), taskserver)
        taskserver.add_insecure_port("[::]:8080")
        try:
            taskserver.start()
            logging.info("Taskapi ready to serve requests")
            taskserver.wait_for_termination()
            print("Ready")
        except:
            logging.info("Shutting down server")
            taskserver.stop(None)
