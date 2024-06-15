class Card {
    constructor(json) {
        const parsedJson = this.parseJson(json);
        this.type = parsedJson['type'];
        this.cost = parsedJson['cost'];
        this.inkable = parsedJson['inkable'];
        this.text = parsedJson['text'];
    }

    parseJson(json) {
        switch (apiToUse) {
            case 'lorcana-api':
                return {'type': json.Type, 'cost': json.Cost, 'inkable': json.Inkable, 'text': json.Body_Text}
            case 'lorcast':
                return {'type': json.type, 'cost': json.cost, 'inkable': json.inkwell, 'text': json.text}
        }
    }
}