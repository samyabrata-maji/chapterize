export function cn(...rest: string[]) {
    return rest.reduce((acc, value) => {
        return `${value} ${acc}`
    })
}

export function validateYtUrl(url: string): boolean {
  const urlValidationRegex = /(https:\/\/|)(www.|)youtu(|.)be(.com|)\/(watch\?v=|watch\?*&v=|)(\w+)*/;
  return urlValidationRegex.test(url)
}

export function extractVideoId(url: string) {
    let videoId = "";
  
    const regex1 = /youtube\.com\/watch\?v=(.*)/;
    const regex2 = /youtu\.be\/(.*)/;
  
    const match1 = url.match(regex1);
    const match2 = url.match(regex2);
  
    if (match1 && match1[1]) {
      videoId = match1[1];
    } else if (match2 && match2[1]) {
      videoId = match2[1];
    }

    if (videoId) videoId = videoId.trim()
  
    return videoId;
  }

export function formatSecondsToTimeString(seconds: number): string {
  try {
    const hours = Math.floor(seconds / 3600);
    const remainingMinutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    const formattedMinutes = remainingMinutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    if (hours <= 0) return `${formattedMinutes}:${formattedSeconds}`

    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  } catch {
    return seconds.toString();
  }
}

export function parseRawTimestamp(timestamp: string[]) {
    let result: string[] = []

    for (let i=0; i<timestamp.length; i++) {
        let element = timestamp[i]?.trim()?.split("\n")
        
        for (let j=0; j<element.length; j++) {
            let parts = element[j].split("=")
            const time = parts[0].split("-")[0]

            try {
              const timestring = formatSecondsToTimeString(Number(time))
              result.push(`${timestring} ${parts[1]}`)
            }
            catch (error: any) {}

            console.log(result.length)
        }
    }
    console.log(result)
    return result;
}


export function timestampArrayToString(timestamp: string[]) {

  if (timestamp.length === 0) return ""
  
  return timestamp.reduce((acc, curr) => {
    return `${acc}\n${curr}`
  }, "")
}
