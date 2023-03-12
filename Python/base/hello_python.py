
class Robot:
    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

    def say_hello(self):
        print('hello, my name is ' + self.name, ', what`s your name?')


robot1 = Robot('Li lei', 20)
robot1.say_hello()
