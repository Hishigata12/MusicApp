def NUMBER_TO_NUMBERS(number, count):
    bits = []
    for i in range(0, count):
        number += 1
        current_bit = 0
 
        #TODO: get current bit without iterating...
        while (number / (2 ** current_bit)) % 2 == 0: current_bit += 1
 
        number = ((number / (2 ** current_bit) + 1) / 2) - 1
        bits.insert(0, current_bit)
    return number, tuple(bits)

def NUMBERS_TO_NUMBER(number, numbers):
    number += 1
    for i in numbers:
        number = (number * 2 - 1) * (2 ** i)
    return number - 1

r = (20, 15, 99, 7)
x = NUMBERS_TO_NUMBER(0, r)
y = NUMBER_TO_NUMBERS(x, 4)
print(r)
print(x)
print(y)