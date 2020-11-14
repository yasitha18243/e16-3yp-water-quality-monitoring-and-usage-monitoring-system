import logging
from concurrent.futures import ThreadPoolExecutor
from grpc import server
import task_pb2, task_pb2_grpc


class TaskapiImpl:
    """'Implementation of the Taskapi service"""

    def __init__(self):
        # TODO: initialise attributes to store our tasks.
        self.clientlist = task_pb2.Clients()
        pass

    def addClient(self, request, context):
        logging.info(f"adding client {request.noOfTanks}")

        length = len(self.clientlist.clients)
        newClient = task_pb2.Client(id = length, fName = request.fName, lName = request.lName, noOfTanks = request.noOfTanks)
        self.clientlist.clients.append(newClient)
        print("{} is added with {} tanks.".format(request.fName, request.noOfTanks))
        print("\n")
        return task_pb2.Id(id = length)
        # TODO: implement this!

    def delClient(self, request, context):
        logging.info(f"deleting client {request.id}")
        # TODO: implement this!


        noOfClients = len(self.clientlist.clients)   #get total number of tasks

        for i in range(noOfClients):  #iterate through all tasks till find a match

            if(self.clientlist.clients[i].id == request.id):   #if found a match, remove and return it

                print("Removed clientID: ", self.clientlist.clients[i].id)
                return self.clientlist.clients.pop(i)                
               
                
        print("Client not found!!")   #if no matches print this
        return

    def listClients(self, request, context):
        logging.info("returning client list")
        # TODO: implement this!
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
        except:
            logging.info("Shutting down server")
            taskserver.stop(None)
