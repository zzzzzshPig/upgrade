
class Animate:
    __siyou = 1

    def __init__(self) -> None:
        print('Animate')


class Cat(Animate):
    def __init__(self) -> None:
        super().__init__()
        print('Cat')


class CoffeeCat(Cat):
    def __init__(self) -> None:
        super().__init__()
        print('coffeeCat')


class Dog(Animate):
    def __init__(self) -> None:
        super().__init__()
        print('dog')


class AlaskanMalamuteDog(Dog):
    def __init__(self) -> None:
        super().__init__()
        print('AlaskanMalamuteDog')


class Pet(CoffeeCat, AlaskanMalamuteDog):
    def __init__(self) -> None:
        super().__init__()
        print('Pet')


Pet()
