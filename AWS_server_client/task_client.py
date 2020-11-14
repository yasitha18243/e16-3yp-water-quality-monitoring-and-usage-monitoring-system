

from typing import Sequence, Mapping, Tuple
import random, string, logging, grpc
import task_pb2, task_pb2_grpc


def random_string_generator(str_size, allowed_chars):
    return "".join(random.choice(allowed_chars) for x in range(str_size))


# Test that will be used to grade addTask
def test_add(stub, count) -> Mapping[int, str]:
    tasks = {}
    for i in range(count):
        name1 = input("Enter first name: ")
        name2 = input("Enter last name: ")
        tanks = int(input("Enter number of tanks: "))
        response = stub.addClient(task_pb2.ClientDetails(fName = name1, lName = name2, noOfTanks = tanks))
        tasks[response.id] = [name1, name2, tanks]
        print("\n")
    return tasks


# Test that will be used to grade listTask
def test_list(stub, tasks) -> None:
    response = stub.listClients(task_pb2.Empty())
    
    for t in response.clients:
        # Is the proper task desc is returned for this id?
        print(t)
        


# Test that will be used to grade delTask
def test_del(stub, task_ids) -> None:
    print("Deleting Clients\n")
    for i in task_ids:
        stub.delClient(task_pb2.Id(id=i))


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    with grpc.insecure_channel("54.84.225.29:8080") as channel:
        stub = task_pb2_grpc.TaskapiStub(channel)
        
        tasks = test_add(stub, 3)
        logging.info(f"added tasks {tasks}")
        test_list(stub, tasks)
        test_del(stub, tasks.keys())
