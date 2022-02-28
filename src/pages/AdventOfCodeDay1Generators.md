Advent of Code Day 1: Fun With Generators

< intro about AoC >
```
def combine():
    inputs = 0
    items = [(yield), (yield), (yield),]
    while True:
        items[inputs%3] = yield sum(items)
        inputs += 1
```

