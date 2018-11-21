export default class MapExpander {
  public expandMap(currentMap: any, pathString: string, mapValue: any) {
    let pathTokens = pathString.split('/');
    if (pathTokens[0] === '') {
      pathTokens = pathTokens.slice(1);
    }
    let mapIteration = currentMap;
    let tokenNames: Array<string> = [];
    pathTokens.map((token, index) => {
      let updatedToken = token;
      if (token[0] === '{' && token[token.length - 1] === '}') {
        updatedToken = '*';
        tokenNames.push(token.substring(1, token.length - 1));
      }

      if (!mapIteration[updatedToken]) {
        mapIteration[updatedToken] = {};
      }

      if (index === pathTokens.length - 1) {
        if (mapIteration[updatedToken]._value) {
          throw new Error(`Path already exists: ${pathString}`);
        }
        mapIteration[updatedToken]._value = mapValue;
        mapIteration[updatedToken]._tokens = tokenNames;
      } else {
        mapIteration = mapIteration[updatedToken];
      }
    });
    return currentMap;
  }

  public getMapValue(currentMap: any, pathString: string) {
    let pathTokens = (pathString || '/').split('/');
    if (pathTokens[0] === '') {
      pathTokens = pathTokens.slice(1);
    }

    let tokenList: Array<string> = [];
    let mapIteration = pathTokens.reduce((acc, token) => {
      if (!acc) {
        return null;
      } else if (acc[token]) {
        return acc[token];
      } else if (acc['*']) {
        tokenList.push(token === '' ? null : token);
        return acc['*'];
      }
      return null;
    }, currentMap);

    if (!mapIteration) {
      return null;
    }

		let tokenMap: { [s: string]: string; } = {};
    mapIteration._tokens ? mapIteration._tokens.map((token: string, index: number) => {
      tokenMap[token] = tokenList[index];
    }) : [];
    return mapIteration ? {
      value: mapIteration._value,
      tokens: tokenMap
    } : null;
  }
}
