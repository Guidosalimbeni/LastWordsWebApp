const data_inmates ={ 
    1:{"name": "Autry, James David","Last Statement": "This inmate declined to make a last statement."}, 
    2: {"name": "Hall, Justen Grant", "Last Statement": "Yeah, I want to address the Roundtree family and apologize for the pain and suffering I caused. And to the Diaz’s family that I had to put you through this, it should have never happened. And to my mom and Morelia I love you and I’m going to miss you all. I’m ready"},
    3:{"name": "Jones, Quintin Phillippe","Last Statement": "TI would like to thank all of the supporting people who helped me over the years.  To mad Maddie, my twin Sonja, Angie, and all the homies.  AKA money and Peruvian queen including crazy Dominican.  I was so glad to leave this world a better, more positive place.  It’s not an easy life with all the negativities.  Love all my friends and all the friendship’s that I have made.  They are like the sky.  It is all part of life, like a big full plate of food for the soul.  I hope I left everyone a plate of food full of happy memories, happiness and no sadness.  I’m done warden."}, 
    4:{"name": "Ochoa, Abel Revill","Last Statement": "Yes sir. I would like to thank God, my dad, my Lord Jesus savior for saving me and changing my life. I want to apologize to my in-laws for causing all this emotional pain. I love y’all and consider y’all my sisters I never had. I want to thank you for forgiving me. Thank you warden."}, 
    5:{"name": "Runnels, Travis Trevino","Last Statement": "None"}, 
    6:{"name": "Sparks, Robert","Last Statement": "Umm, Pamela can you hear me Stephanie, Hardy, Marcus tell all the family I love them. I am sorry for the hard times and what hurts me is that I hurt y’all and um even for y’all too and Patricia she wrote me tell Patricia I wrote her back and to tell y’all what I said. I love y’all. I am ready"}, 
    7:{"name": "Soliz, Mark Anthony","Last Statement": "It’s 6:09 on September 10th, Kayla and David, I wanted to apologize for the grief and the pain that I caused y’all .I’ve been considering changing my life. It took me 27 years to do so. Man, I want to apologize, I don’t know if me passing will bring y’all comfort for the pain and suffering I caused y’all. I am at peace. I understand now the pain that I caused y’all man, I don’t know what else to say. It took a while to drag these years out. I am going with a humble heart. I made wrong decisions but, I forgave myself. I made a discussion not because of myself but because of everyone else. I forgave myself not for y’all but the pain I caused to my family. Oh man I didn’t’ know if y’all would come or not but I am glad y’all did so I could talk to y’all. I know the pain when I talk to my grandma. I’m just glad I got a chance to talk to y’all.Freddie, Sonia, Sofia, Oh man, thank you Jesus. I love y’all but glad you brought Jesus into my life. Mom and Dad throughout the years I turned my back on God for the wrong that I thought He committed now that I have found Him, let everyone know that I love them because He is there. I have love for y’all. Tell mom I love them and let dad know. To all my supporters out there thank you for the support and positive wisdom and words. And to all the people who wrote me, and to all the people who have people on death row show them love and support. They need it. Thank you for putting in the effort. I want to thank those that did. Bubble and Sofia God loves y’all. I love y’all. Mr. Warden I’m ready."}, 
    8:{"name": "Crutsinger, Billy Jack","Last Statement": "Hi ladies I wanted to tell ya’ll how much I love you. Thank you for being here for me. You have brought pleasure into my life in the short time I lived and known ya’ll. Ya’ll are very special not just to me but to the unit. There are so many lives that yall have touched over there that yall don’t even know about that guys talk about in the back .I am at peace now with and going to be with Jesus and my family. I am going to miss those pancakes and those old time black and white shows. Where I am going everything will be in color. There is a lot of this I don’t understand but the system is not completely right. It’s not completely wrong but, it is something that has to be done until something better comes along. But, I am at peace with that and I am ok and I can live with that. The 15 or 16 years that I have been on death row I have never had a case that doesn’t mean that I am a good guy or nothing I have the Lord in my heart and He has given me peace I will be honest with you. I am going to go tell your mother and David I am glad you made it and you didn’t pass out on the line. OK Warden I am ready."}, 
    9:{"name": "Larry Ray Swearingen","Last Statement": "Lord forgive them. They don’t know what they are doing"}, 
    10:{"name": "King, John William","Last Statement": "Capital Punishment: Them without the capital get the punishment."}, 
    11:{"name": "Billie Wayne Coble","Last Statement": "Yes Sir, that will be five Dollars I love you, I love you, and I love you. Mike I love you. Where’s Nelley at? I love you. That will be five dollars. Take Care."}, 
    12:{"name": "Braziel, Alvin Avon Jr.","Last Statement": "Yes Sir, I would like to thank the Shape Community Center for all their support. I would like to thank all those overseas, Italy and France, for their support for the death row prisoners. I would also like to apologize to Lori for the second time for her husband dying at my hand. To the White family and to Tashell for not being there, I Love you. I’m finished Warden you may proceed."}, 
    13:{"name": "Garcia, Joseph Christopher","Last Statement": "Yes Sir. Dear Heavenly Father please forgive them for they know not what they do."}, 
    // 14:{"name": "Autry, James David","Last Statement": ""}, 
    // 15:{"name": "Autry, James David","Last Statement": ""}, 
    // 16:{"name": "Autry, James David","Last Statement": ""}, 
    // 17:{"name": "Autry, James David","Last Statement": ""}, 
    // 18:{"name": "Autry, James David","Last Statement": ""}, 
    // 19:{"name": "Autry, James David","Last Statement": ""}, 
    // 20:{"name": "Autry, James David","Last Statement": ""}, 
    // 21:{"name": "Autry, James David","Last Statement": ""}, 
    // 22:{"name": "Autry, James David","Last Statement": ""}, 
    // 23:{"name": "Autry, James David","Last Statement": ""}, 
    // 24:{"name": "Autry, James David","Last Statement": ""}, 
    // 25:{"name": "Autry, James David","Last Statement": ""}, 
    // 26:{"name": "Autry, James David","Last Statement": ""}, 
    // 27:{"name": "Autry, James David","Last Statement": ""}, 
    // 28:{"name": "Autry, James David","Last Statement": ""}, 
    // 29:{"name": "Autry, James David","Last Statement": ""}, 
    // 30:{"name": "Autry, James David","Last Statement": ""}, 
    // 31:{"name": "Autry, James David","Last Statement": ""}, 
    // 32:{"name": "Autry, James David","Last Statement": ""}, 
    // 33:{"name": "Autry, James David","Last Statement": ""}, 
    // 34:{"name": "Autry, James David","Last Statement": ""}, 
    // 35:{"name": "Autry, James David","Last Statement": ""}, 
    // 36:{"name": "Autry, James David","Last Statement": ""}, 
    // 37:{"name": "Autry, James David","Last Statement": ""}, 
    // 38:{"name": "Autry, James David","Last Statement": ""}, 
    // 39:{"name": "Autry, James David","Last Statement": ""}, 
};

export default data_inmates;