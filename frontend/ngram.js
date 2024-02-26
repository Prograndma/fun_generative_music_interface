        class NgramModel {
            constructor(n, data) {
                this.n = n;
                this.data = data;
            }
            prob(context, token) {
                var target_occurences = 0;
                let followers = [];
                let total_occurences = 0;
                let context_len = context.length;
                for (let key in this.data) {
                    if (key.startsWith(context)) {
                        followers.push([key.slice(context_len), this.data[key]]);
                        total_occurences += this.data[key];
                    }
                }
                if (context + token in this.data) {
                    target_occurences = this.data[context + token];
                }
                else {
                    target_occurences = 0;
                }
                return target_occurences / total_occurences;
            }

            random_token(context) {
                var dist = {};
                for (let key in this.data) {
                    if (key.startsWith(context)) {
                        let context_len = context.length;
                        dist[key] = this.prob(context, key.slice(context_len));
                    }
                }
                let possibilities = Object.keys(dist);
                let r = Math.random();
                var cum_prob = 0;
                for (let i = 0; i < possibilities.length; i++) {
                    var possibility = possibilities[i];
                    cum_prob += dist[possibility];
                    if (r < cum_prob || r == cum_prob) {
                        return possibility.slice(context.length);
                    }
                }
            }
            random_text(token_count) {
                var text = '';
                var starting_context = [];
                for (let i = 0; i < this.n-1; i++) {
                    starting_context.push("<START> ");
                }
                var context = starting_context;
                for (let i = 0; i < token_count; i++) {
                    var new_token = this.random_token(context.join('').trim()).trim();
                    if (new_token == "<END>"){
                        return text.trim();
                    }
                    if(new_token.charAt(new_token-1) != ' '){
                        new_token+=' ';
                    }
                    text += new_token;
                    context.push(new_token);
                    context = context.slice(-(this.n-1));
                    if (this.n == 1) {
                        context = [];
                    }
                }
                return text.slice(0,-5).trim();
            }
        }

        var bigram_model = new NgramModel(2, bigramData);
        var trigram_model = new NgramModel(3, trigramData);

        function generateTypes(){
           // var model_to_use = document.getElementById("model").value;
           var model_to_use = "bigram";
            
           var output_types;
            if (model_to_use == "bigram"){
                output_types = bigram_model.random_text(10);
            }else{
                output_types = trigram_model.random_text(10);
            }
            //var results = document.getElementById("results");
            console.log(output_types);
        }
