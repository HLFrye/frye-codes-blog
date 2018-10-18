---
path: "/units-of-measure"
date: "2018-09-15T23:53:20.729Z"
title: "F# Units of Measure for Financial Applications"
tags: ["F#", "Units of Measure"]
summary: "Demonstrates the use of the Units of Measure functionality in F#"
---
![Image of financial newspaper](markus-spiske-484245-unsplash.jpg)
<a style="background-color:black;color:white;text-decoration:none;padding:4px 6px;font-family:-apple-system, BlinkMacSystemFont, &quot;San Francisco&quot;, &quot;Helvetica Neue&quot;, Helvetica, Ubuntu, Roboto, Noto, &quot;Segoe UI&quot;, Arial, sans-serif;font-size:12px;font-weight:bold;line-height:1.2;display:inline-block;border-radius:3px" href="https://unsplash.com/@markusspiske?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge" target="_blank" rel="noopener noreferrer" title="Download free do whatever you want high-resolution photos from Markus Spiske"><span style="display:inline-block;padding:2px 3px"><svg xmlns="http://www.w3.org/2000/svg" style="height:12px;width:auto;position:relative;vertical-align:middle;top:-1px;fill:white" viewBox="0 0 32 32"><title>unsplash-logo</title><path d="M20.8 18.1c0 2.7-2.2 4.8-4.8 4.8s-4.8-2.1-4.8-4.8c0-2.7 2.2-4.8 4.8-4.8 2.7.1 4.8 2.2 4.8 4.8zm11.2-7.4v14.9c0 2.3-1.9 4.3-4.3 4.3h-23.4c-2.4 0-4.3-1.9-4.3-4.3v-15c0-2.3 1.9-4.3 4.3-4.3h3.7l.8-2.3c.4-1.1 1.7-2 2.9-2h8.6c1.2 0 2.5.9 2.9 2l.8 2.4h3.7c2.4 0 4.3 1.9 4.3 4.3zm-8.6 7.5c0-4.1-3.3-7.5-7.5-7.5-4.1 0-7.5 3.4-7.5 7.5s3.3 7.5 7.5 7.5c4.2-.1 7.5-3.4 7.5-7.5z"></path></svg></span><span style="display:inline-block;padding:2px 3px">Markus Spiske</span></a>
<!-- start -->
Units of Measure are an F# language feature that doesn't get nearly enough attention.  It is somewhat unique [*](https://stackoverflow.com/questions/107243/are-units-of-measurement-unique-to-f) to F#, among mainstream languages at least.    Maybe it's because I was working on CAD software when I first began learning about F# (a CAD system that, as a result of its heritage, had two different internal types of measurements), but it was one of the first features of F# that stood out to me as a "wow, that could really help prevent problems" feature.  Nowadays I work on financial software rather than CAD software, and units of measure are still a powerful feature that make it easy to avoid a whole class of bugs.

For the examples I'm going to use in this post, imagine yourself working on a system that allows investors to track their investments in a foreign exchange.  Since I'm based in the US, for a concrete example imagine US based investors (who have to report on their holdings to their investors and to the government in USD), who own shares of stock listed on the Tokyo Stock Exchange, which are traded in JPY.  That's just a motivating example though, the code won't be specific to that exchange or those currencies.  The application we'll be considering simply receives a set of data (buy/sell activities, fx rate conversions, etc), and outputs calculated values.  In this simplified example, we'll just accept a single buy and a single sell, as well as a single FX Rate, and calculate the amount of money made or lost on the sale.

Two terms we'll be using a lot here are __Notional Currency__ (abbreviated nc), which in this case is the currency the underlying security is traded in (in the example above, JPY), and __Reporting Currency__ (abbreviated rc), which is the currency that must be used in reports (in this case, USD).

To start with, I'll present some code that doesn't use units of measure, and has a few bugs hidden in it.  The code compiles and runs just fine, but presents the user with incorrect information.  Since this is a fairly small, contrived example, these bugs may seem obvious; but, if you consider a much more complex system, it's easy to see how errors like this could potentially creep in.  Then, I'll show how adding units of measure turns these bugs into compile time errors.

So, lets imagine we have a fairly simple reporting process, that just involves printing to the console.  We might have two functions, like so:

```fsharp
module Output =
    open Types

    let printNotional (input: decimal) = 
        printfn "Notional:  %g" input

    let printReporting (input: decimal) =
        printfn "Reporting: %g" input
```
(note that I'm being more explicit with types than is necessary to show the changes when we add units of measure, ordinarily we wouldn't need to explicitly annotate the type of input in the above functions)

Simple enough.  Now, lets look at how we might perform our calculations:

```fsharp
module Calculations =
    open Types

    let GainLoss (buy: Activity) (sell: Activity) =
        let quantitySold = sell.Quantity
        let priceDiff = sell.Price - buy.Price
        quantitySold * priceDiff

    let ConvertToReporting (fxrate: decimal) (amount: decimal): decimal = 
        amount / fxrate
```

So far so good.  We have a function that can calculate your gain/loss based on a buy activity and a sell activity, and we have another function that can take an fxrate and an amount of notional currency, and return the reporting currency value.  Now, lets look at how this could be used:

```fsharp
    let input = Loading.parseSample()
    let gains = Calculations.GainLoss input.Events.[0] input.Events.[1]

    printfn "The resulting gain/loss of this transaction:"
    Output.printNotional gains
    Output.printReporting gains
```

So far so good!  It compiles and runs, and if you're not paying close attention to the output, you might not even notice that it's printing the same value as the notional gain and the reporting gain.

Thankfully, you've got a very good QA who did notice this before the build went out to customers, and thought something must be amiss.  Now, lets look at how we can use units of measure to make this a compile time failure, so that you can both fix this bug and prevent similar bugs from happening again!

First, lets define three units of measure:

```fsharp
    [<Measure>] type nc
    
    [<Measure>] type rc

    [<Measure>] type unit
```

Units of measure are always prefaced with the special Measure attribute, and otherwise appear to be an entirely empty type.  By itself, it doesn't do much.  However, lets start by updating the types on our output functions so that they only accept they correct decimal types:

```fsharp
module Output =
    open Types

    let printNotional (input: decimal<nc>) = 
        printfn "Notional:  %g" input

    let printReporting (input: decimal<rc>) =
        printfn "Reporting: %g" input
```

Simple enough change.  Now we can't accidentally report an NC value as an RC value or vise versa.  However, now our program fails to compile because we're trying to pass a regular decimal type to both functions, which won't work.  But we know our input values on our activities are always in NC, so lets annotate the Activity type, like so:

```fsharp
    type Activity = {
        Price: decimal<nc/unit>
        Quantity: decimal<unit>
    }
```

The reasoning here is as follows: the price of a stock is the unit price, or the amount of (nominal) currency that we need to exchange for one unit of stock.  The quantity is simply the number of units of stock we own.  But wait!  We didn't define a unit of measure named "nc/unit", just nc and unit.  What is this nc/unit thing, and how does it work?

F# allows you to create new units of measure automatically out of existing units.  These work just the way you would expect them to: a `decimal<nc/unit>`, multiplied by a `decimal<unit>`, will return a `decimal<nc>`.

Now, with no additional changes to our GainLoss function, the compiler figures out that the return type is a `decimal<nc>`, which we can pass to printNotional and fix the error on that line.  And the remaining error on our printReporting line lays clear the problem: we tried to pass a notional currency value to the reporting currency output.  So now we know we need to do that conversion, by calling the ConvertToReporting function.  But what should be the type of the fxrate argument passed to ConvertToReporting?

At the time of this writing, if you Google "JPY to USD", you'll find an exchange rate of 0.0090 USD per JPY.  So, in F# terms, the type of this value is `decimal<rc/nc>`.  Again, since this is another compound unit of measure, F# knows that this can be used to convert between types - ie, that a `decimal<nc>` value multiplied by a `decimal<rc/nc>` value will give you a `decimal<rc>` value.  This automatic deduction by the compiler is one of my favorite things about using this feature, because it so directly mirrors how we might write down these equations or solve them on paper.

So, lets change the type of ConvertToReporting to `decimal<rc/nc> -> decimal<nc> -> decimal<rc>`.  But in doing so, we make clear the other bug embedded in the original code!  Because we were dividing the amount by the fxrate instead of multiplying, the type system automatically deduces that something isn't right.  If we then change that division to a multiplication, the application will compile, and we've now found and fixed two bugs just by using the type system.  With these changes in place we have not only fixed these bugs, but we've also prevented an entire class of bugs from cropping up again!  Not too bad.

One final benefit of this approach: documentation.  By being explicit with these types and enforcing the conversion between them, we're actually doing a better job of documenting what these values should be than if we simply described them as decimals.  New developers on the team, or just as likely myself 6 months later, can easily see the relationships between the types, and also whether the FXRate should be described in terms of JPY per USD or USD per JPY.

If you want to read up more on units of measure in F#, the [post about Units of Measure on FSharp For Fun And Profit site](https://fsharpforfunandprofit.com/posts/units-of-measure/) has a lot more examples of usages than I have here.