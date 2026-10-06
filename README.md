# logic master

<img width="1051" alt="2" src="https://user-images.githubusercontent.com/105588693/210104501-835852f0-d59f-4af3-b56f-ed8ea48dec98.png">

as I tried to learn how logic gates work myself, I built a tool to visualize the connections.

## play it

a playable version is available [here](https://iamtomo.com/play/logic-master).

## what this is good for?

I've been fascinated by the simplicity and complexity of binary lately. there is something beautiful about a system that works on such a fundamental level, which is why I set out to learn more about calculating in binary (without converting to the decimal system), which then led me to discovering logic gates. my philosophy is that the best way to learn is to get your hands dirty and seek out real-world experience. as I watched some videos about logic gates, I thought to myself... I can build that! so I first made a few functions to calculate the output of `xor(a, b)`, `and(a, b)` and `or(a, b)` functions. in doing this I tried to also explain it to other people on [my blog](https://neontomo.com/blog/?id=can-i-teach-you-to-add-numbers-in-binary-in-20-mins) as a way of making sense of it myself. but the one thing that felt too difficult for me was to develop a visual logic gate connector tool, and it took me a few weeks to pluck up the courage to try building it. it didn't turn out as difficult as I thought, which is a great lesson in the value of just trying the hard things. what I wanted to create was a fun and educational tool that can let anyone understand the connections and truth tables after playing with it and having fun.

## what did I learn?

I learned to trust in my ability to build projects that seem difficult, because while attempting the challenge you grow to meet the challenge. my first iteration of the tool turned out to be quite resource heavy and it crashed my browser when I had too many nodes active. this was because the library I used to create the connections between nodes was rewriting too often and creating fancy bezier curves and animations, leading to bloat. this was one of the hardest challenges of the project: to design a system that connects a line between to points, `(x1, y1)` and `(x2, y2)`, and in doing so calculating the angle between them. this was an easy thing to do with the `<canvas>` html element which allows for drawing between two points with only a few lines, but I didn't want my project to be using canvas. canvas as a way of designing websites has not convinced me, as it reminds me of java applets and flash, and some of the way it works is surprisingly unintituive for me. so I instead looked up the math:
```	
	var angle = math.atan2(y2 - y1, x2 - x1) * 180 / math.pi;
	var distance = (math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)) - 15;
  ```
 
I can't claim to fully understand this equation, but it was fun plugging it into my code and seeing how it worked perfectly, as math doesn't care about your specific code. if all the variables are correct, the answer will be correct!

<img width="609" alt="nodes" src="https://user-images.githubusercontent.com/105588693/210263263-02f06569-34fb-4ae7-b996-d409182528f7.png">

this solution was simpler because it draws a single line between elements, instead of curves that move beautifully between nodes, but I am happy with a robust system that doesn't crash my browser every five minutes. sometimes less is more.

## use it yourself

have fun and experiment with it! you may edit my code and re-use it if you credit me in the source code.
