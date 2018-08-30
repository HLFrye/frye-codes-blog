---
path: "/fsharp-twentyfour"
date: "2018-08-27T02:23:19.086Z"
title: "Twenty Four Solver in F#"
tags: ["F#", "Math"]
summary: "Presents a F# based solver for the Twenty Four game"
---

![Kill some time on a road trip with math!](brian-erickson-754641-unsplash.jpg)
<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@bw_erickson?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Brian Erickson"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Brian Erickson</span></a>
<!-- start -->
A while back I came across [Mark Dominus's article](https://blog.plover.com/2017/03/) describing the twenty-four game.  For the uninitiated, this is a simple sort of math game: given four digits, find a way to come up with an equation using only those digits which equals twenty-four.  For some sets of numbers, this is easy and there are a lot of solutions (for instance, using the numbers 0, 2, 4, and 8).  For some, this is impossible (ie, 0, 1, 2, 3).  And for others, this is possible but very tricky (3, 3, 8, 8).

If you find yourself on a long car trip, and you've run out of games to play on your phone, this can even be a road trip game.  Many states have licenses plates that feature 4 digits, so spot a license plate, and see how quickly you can find a solution that equals 24.  Or more than one solution, for that matter.  Admittedly, not the most exciting road trip game, but still something to pass the time.

Anyway, I thought it would be interesting to write a solver for this in F#.  I decided to approach the problem in three main parts. The first would be to generate all possible permutations of the 4 digits provided as input, since they can appear in any order in the solution. Next, generate all possible ways to choose 3 operators. Finally, use those 3 operators and 4 digits to build all possible expression trees, and evaluate those trees to see if they equal 24.

## Finding all the permutations

My initial approach to this part was to come up with my own simple implementation.  I'd grab each digit from the starting list, then find all permutations of the 3 remaining digits, and append those permutations to the digit I chose.  This worked, but I wasn't a big fan of it; it seemed like it had to instantiate a lot of child lists and do a lot of intermediate work to get to the outcome.  Plus, it occurred to me that I was probably not the first programmer to need all permutations of a given input, and that there might already be an algorithm out there waiting for me.  It was time to turn to Google.

Google immediately showed me a solution that, in retrospect, I had learned about years ago in my undergraduate algorithms class: Heap's algorithm.  The [Wikipedia article on Heap's Algorithm](https://en.wikipedia.org/wiki/Heap%27s_algorithm) gives a good overview and a psuedocode implementation; however, my initial attempt to implement that pseudocode didn't quite perform as expected.  After tinkering around with it to see if I'd done something wrong, I clicked over to the talk page, and noticed there was some discussion about whether the pseudocode provided on the page was correct, with a recent comment having the same problem I had.  After that, I decided to click through to the original [publication](https://academic.oup.com/comjnl/article-lookup/doi/10.1093/comjnl/6.3.293).  On the second page, the article lists the swaps necessary to generate all 24 permutations of a four digit sequence (assuming indexes start at 1): 

```
1,2 1,3 1,2 1,3 1,2 1,4 1,2 1,3 1,2 1,3 1,2 2,4
1,2 1,3 1,2 1,3 1,2 3,4 1,2 1,3 1,2 1,3 1,2
```

Looking at that, I decided to split my implementation in two: one function to generate the sequence of swaps, and another function to perform each swap.  The function to generate the swaps would be easier to test in F# interactive window, and the function to perform the swaps would be a simple affair.  Plus, since I already had the canonical answer to which swaps the algorithm should generate for an input of size 4, I could easily verify if I'd implemented it correctly.

Generating the swaps wound up looking like this:
```fsharp
let rec getSwaps maxIndex =
    seq {
        if maxIndex = 1 then
            yield (0, 1)
        else
            yield! getSwaps (maxIndex-1)
            for i = 0 to maxIndex - 1 do
                match maxIndex % 2 with
                | 0 -> yield (0, maxIndex)
                | 1 -> yield (i, maxIndex)
                yield! getSwaps (maxIndex-1)
    }
```

Here we're making use of both `yield` and `yield!`, which have subtly different meanings.  For those unfamiliar with F# and sequence expressions, the closest comparison is probably the IEnumerable generators in C#, using the `yield` statement.  The `yield` here works exactly the same as in C#, putting that value direction into the output sequence (or, put another way, providing that value immediately to the consumer of the sequence).  However, `yield!` takes things a step further, and places a whole sequence of values into the output sequence.  You could get the same effect by iterating over the subsequence and yielding each individual item, but the `yield!` syntax makes things much more succinct and clear.

For the case of an array with a maxIndex of 1 (ie, a 2 item array), only one swap is required to generate both permutations.  For larger arrays, first we generate all the swaps for an array one size smaller.  Then, once for each entry in this array, we perform a swap on the last item in the list.  Depending on whether the array size is even or odd, we either swap the first item with the last one (even sized arrays), or the _i_th item in the array.  Finally, after that swap, we again generate all swaps for an array one size smaller, and go through the loop again.

With this in place, performing all the swaps becomes a simple function:

```fsharp
let permutations values =
    let subtract y x = x - y

    let swaps = 
        values
        |> Array.length
        |> subtract 1
        |> getSwaps

    seq {
        yield Array.copy values
        for swap in swaps do
            let temp = values.[fst swap]
            values.[fst swap] <- values.[snd swap]
            values.[snd swap] <- temp
            yield Array.copy values
    }
```

First, this function uses the previously defined getSwaps function to get the list of swaps to perform.  Admittedly, this could have been decided at compile time, but at one point I was considering expanding this to handle sequences of any number of digits.  Once the list of swaps to perform is generated, we then go through that list and yield a copy of each distinct permutation of the values list.  We have to copy the list each time, since otherwise each yield would yield the same array reference. 


![We're going to do a lot of math](chris-liverani-552010-unsplash-cropped.jpg)
<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@chrisliverani?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Chris Liverani"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Chris Liverani</span></a>

## Finding all the operators

Next, we need to create all possible combinations of operators, which first means we have to define what our operators look like.  The simplest approach might be to simply represent them as the characters '+', '-', '*', '/', and '^'.  However, since we eventually need to evaluate these expression trees, lets use a discriminated union instead, which will make several other functions easier to implement:

```fsharp
type expr = 
| Constant of int
| Sum of expr * expr
| Diff of expr * expr
| Prod of expr * expr
| Quot of expr * expr
| Power of expr * expr
```

So, an expression is either a constant number, or a pair of expressions along with the operator to apply.  With this in place, it then becomes really simple to either evaluate an expression, or format it for printing:

```fsharp
let rec calculateExpression expr =
    match expr with
    | Constant x -> float x 
    | Sum (x, y) -> (calculateExpression x) + (calculateExpression y)
    | Diff (x, y) -> (calculateExpression x) - (calculateExpression y)
    | Prod (x, y) -> (calculateExpression x) * (calculateExpression y)
    | Quot (x, y) -> (calculateExpression x) / (calculateExpression y)
    | Power (x, y) -> (calculateExpression x) ** (calculateExpression y)

let rec formatExpression expr =
    match expr with
    | Constant x -> sprintf "%d" x
    | Sum (x, y) -> sprintf "(%s + %s)" (formatExpression x) (formatExpression y)
    | Diff (x, y) -> sprintf "(%s - %s)" (formatExpression x) (formatExpression y)
    | Prod (x, y) -> sprintf "(%s * %s)" (formatExpression x) (formatExpression y)
    | Quot (x, y) -> sprintf "(%s / %s)" (formatExpression x) (formatExpression y)
    | Power (x, y) -> sprintf "(%s ^ %s)" (formatExpression x) (formatExpression y)
```
Both of these functions follow the same structure.  In each case, we're looking at the top of the expression tree provided.  If it's a constant, either its value or a string representing it is produced.  Otherwise, we then perform the same action on both leaves (since all of our operators are binary, we know there's only two leaves), and then either perform the requested mathematical operation on the results of those calls, or output a string representing that expression.

With our expressions defined now, we can then create a function to give us every sequence of operator.  Again, since technically the list of operators is defined at compile time, and we know how many operators we'll need at compile time (3, to combine 4 digits), this could have been defined then as well, but this gives us the flexibility of working with larger sets of digits in the future.  

The following function takes a list of candidate expressions, the number of expressions we want in our output, and an initially empty list of the expressions we've built up so far.  It will then return a sequence of all possible sets of the given expressions with the given length:

```fsharp
let rec buildAllExpressions expressions count expressionList =
    seq { 
        for expr in expressions do
            let nextList = (List.Cons (expr, expressionList))
            match count with
            | 1 -> yield nextList
            | _ -> yield! buildAllExpressions expressions (count - 1) nextList
    }

// Using the above function to generate the list of expressions:
let allExpressions =
    buildAllExpressions [Sum;Quot;Diff;Prod;Power] 3 []
```    

## Building the trees

So, with our set of all expressions now generated, and all permutations of the input digits provided, now we can generate every possible expression tree using those values.  Once thoes are generated, we simply need to filter those expressions to those that evaluate to our target, and we'll have a set of solutions.

Here, by the way, is where my attempt to make everything input length agnostic fell apart and I had to simply hard code the possibilities.  I might come back to this in the future, but since this was all for fun I didn't want to spend too much time overengineering it...

```fsharp
let buildAllTrees (opers:list<expr * expr -> expr>) (constants:list<expr>) = 
    let (oper1, oper2, oper3) = (opers.[0], opers.[1], opers.[2])
    let (constant1, constant2, constant3, constant4) = (constants.[0], constants.[1], constants.[2], constants.[3])
    let tree1 = oper3(oper1(constant1, constant2), oper2(constant3, constant4))
    let tree2 = oper3(oper2(oper1(constant1, constant2), constant3), constant4)
    let tree3 = oper3(constant1, oper2(constant2, oper1(constant3, constant4)))
    let tree4 = oper3(oper2(constant1, oper1(constant2, constant3)), constant4)
    let tree5 = oper3(constant1, oper2(oper1(constant2, constant3), constant4))

    [tree1;tree2;tree3;tree4;tree5]
```

Given a list of operators, and a list of constant values, this generates the expression trees that come from combining them.  This function doesn't need to worry about trying to create every order of constant and operator, because we can just call it multiple times with the already generated sequences of every operator and constant, like so:

```fsharp
    let allTrees =
        allConstants
        |> Seq.map Seq.toList
        |> Seq.map (fun constants ->
            allExpressions
            |> Seq.map (fun expressions ->
                buildAllTrees expressions constants)
            |> Seq.concat)
        |> Seq.concat
```

And finally.. figure out which ones meet our goal of 24:

```fsharp
    allTrees
    |> Seq.filter (calculateExpression >> (-) goal >> Math.Abs >> (>) 0.000001)
    |> Seq.distinct
```

Note that since we're dealing with floating point calculations, there may be a slight amount of error in what should otherwise be a valid solution.  That's why the filter function provided above doesn't do a straight comparison to see if the result is equal to 24.0.  Here we're using a tolerance of 0.000001 to determine equality, mostly because that seemed good enough based on the test cases I ran.  Though if anyone can find an example of a solution that shouldn't equal 24 but is accepted because of the tolerance I've chosen, I'd love to see it :)

So!  Put all of that together, and we've got a simple command line app that can find out all the ways to turn a set of four digits into an equation that equals 24.  If you want to play around with this, the full source code and project files can be found on [GitHub](https://github.com/HLFrye/TwentyFourCLI/blob/master/TwentyFour/Program.fs).